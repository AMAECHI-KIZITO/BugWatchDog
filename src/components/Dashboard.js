import React, {useState,useEffect} from "react"

function Dashboard({userSession}){
  const [totalProjects, setTotalProjects]=useState(0)
  const [outstandingBugs, setOutstandingBugs]=useState(0)
  const [averageBugs, setAverageBugs]=useState(0)
  const [availableDevelopers, setAvailableDevelopers]=useState([])
  const [friends, setFriends]=useState("")
  const [friendRequest, setfriendrequest]=useState([])
  const [numberOfFriendRequest, setNumberOfFriendRequest]=useState("")
  
  //Get developer statistics
  useEffect( () => {
    fetch(`http://localhost:5000/api/v1/get_dashboard_numbers/?userId=${userSession}`)
    .then( rsp => rsp.json())
    .then( data => {
      let statistics=data
      setTotalProjects(statistics.total_projects);
      setOutstandingBugs(statistics.bugs_outstanding);
      setAverageBugs(statistics.average_bugs);
      setFriends(statistics.friends);
    })
    .catch((error)=> console.log(error))
  }, [])

  //Getting unfriended developers
  useEffect( ()=> {
    fetch(`http://localhost:5000/api/v1/get-unfriended-developers/?currentDev=${userSession}`)
    .then(rsp=>rsp.json())
    .then(data=>{
      setAvailableDevelopers(data.developers);
    })
  }, [])
  

  //get friend requests
  useEffect( ()=> {
    fetch(`http://localhost:5000/api/v1/retrieve-friend-requests/?currentDev=${userSession}`)
    .then(rsp=>rsp.json())
    .then(data=>{
      setfriendrequest(data.developers);
      setNumberOfFriendRequest(data.no_of_requests);
    })
  }, [])
  

  return(
    <>
      <div className="row dashboardlinks">
        <div className="col-md-11">
          <h2 style={{color:"gold"}}>Statistics</h2><hr/>
          <div className="row" style={{minHeight:"400px", alignItems:'center', color:"white"}}>
            <div className="dashboardInfo col-6 col-md-4">
              <h4 className="text-center">Total <br/> Projects</h4>
              <p className="text-center">{totalProjects}</p>
            </div>
            <div className="dashboardInfo col-6 col-md-4">
              <h4 className="text-center"><i className="fa-solid fa-bugs"></i> Outstanding</h4>
              <p className="text-center">{outstandingBugs}</p>
            </div>
            <div className="dashboardInfo col-6 col-md-4">
              <h4 className="text-center">Average <i className="fa-solid fa-bugs"></i> per Project</h4>
              <p className="text-center">{averageBugs}</p>
            </div>

            <div className="dashboardInfo col-6 col-md-4">
              <h4 className="text-center"><i className="fa-solid fa-user-group"></i> Friends</h4>
              <p className="text-center">{friends}</p>
            </div>

            <div className="dashboardInfo col-6 col-md-4">
              <h4 className="text-center">
                Friend Requests
                <span className="badge bg-danger rounded-pill" id='view_friend_req' style={{position:"absolute", fontSize:'10px'}}>{numberOfFriendRequest}</span>
              </h4>
              <p className="text-center"><button type='button' className="btn btn-warning btn-sm" data-bs-toggle="offcanvas" data-bs-target="#getFriendRequest">View Requests</button></p>
            </div>

            <div className="dashboardInfo col-6 col-md-4">
              <h4 className="text-center">Add Friend</h4>
              <p className="text-center"><button className="btn btn-warning btn-sm"  data-bs-toggle="offcanvas" data-bs-target="#addFriend">Find a Dev</button></p>
            </div>

          </div>
        </div>

        <div id="OffcanvasSection">
          <div className="offcanvas offcanvas-end" tabIndex="-1" id="addFriend" aria-labelledby="addFriendList" style={{backgroundColor:"#05204a"}}>

            <div className="offcanvas-header">
              <h5 id="addFriends" className="text-light">Add a friend <i className="fa-solid fa-user-group"></i></h5>
              <button type="button" className="btn-close text-reset" id='closeOffCanvas' data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
            </div><hr/>

            {/* Send a Friend Request*/}
            <div className="row offcanvas-body">
              <div className="col-12">
                {(typeof availableDevelopers==="string" || availableDevelopers.length==0)?(
                  <div className="row align-items-center" style={{minHeight:'400px'}}>
                    <div className="col">
                      <h4 className="text-center" style={{color:"grey"}}>No Developers Available</h4>
                    </div>
                  </div>
                ):(
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Developer</th>
                        <th>Stack</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(availableDevelopers).map(dev => 
                      <tr>
                        <td key={dev.serial_no}>{dev.serial_no}</td>
                        <td key={dev.dev_nickname}>{dev.dev_nickname[0].toUpperCase()  + dev.dev_nickname.substring(1)}</td>
                        <td key={`stack ${dev.dev_stack}`}>{dev.dev_stack}</td>
                        <td key={`message${dev.dev_id}`}>
                          <button className="btn btn-warning btn-sm" id={`btnSendRequest${dev.dev_id}`} onClick={()=>{

                            fetch(`http://localhost:5000/api/v1/send-friend-request/?userSession=${userSession}&friendRequestRecipient=${dev.dev_id}`)
                            .then( rsp => rsp.json())
                            .then( data => {
                              fetch(`http://localhost:5000/api/v1/get-unfriended-developers/?currentDev=${userSession}`)
                              .then(rsp=>rsp.json())
                              .then(data=>{
                                setAvailableDevelopers(data.developers);
                              })
                            })
                          }}>Add</button>
                        </td>
                        
                      </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Accept or Decline Friend Request Off Canvas*/}
        <div id="OffcanvasSection">
          <div className="offcanvas offcanvas-start" tabIndex="-1" id="getFriendRequest" aria-labelledby="getFriendRequestList" style={{backgroundColor:"#05204a"}}>

            <div className="offcanvas-header">
              <h5 id="friendRequests" className="text-light">Friend Requests<i className="fa-solid fa-user-group"></i></h5>
              <button type="button" className="btn-close text-reset" id='closeFriendReqOffCanvas' data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
            </div><hr/>


            <div className="row offcanvas-body">
              <div className="col-12">
                {(typeof friendRequest==="string")?(
                  <div className="row align-items-center" style={{minHeight:'400px'}}>
                    <div className="col">
                      <h4 className="text-center" style={{color:"grey"}}>No Friend Requests Available</h4>
                    </div>
                  </div>
                ):(
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>S/N</th>
                        <th>Developer</th>
                        <th>Stack</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(friendRequest).map(dev => 
                      <tr>
                        <td key={dev.serial_no}>{dev.serial_no}</td>
                        <td key={dev.dev_nickname}>{dev.dev_nickname[0].toUpperCase()  + dev.dev_nickname.substring(1)}</td>
                        <td key={`stack ${dev.dev_stack}`}>{dev.dev_stack}</td>
                        <td key={`acceptRequest${dev.dev_id}`}>
                          <button className="btn btn-success btn-sm" id={`btnSendRequest${dev.dev_id}`} onClick={()=>{

                            fetch(`http://localhost:5000/api/v1/accept-friend-request/?invitee=${userSession}&invited=${dev.dev_id}`)
                            .then( rsp => rsp.json())
                            .then( data => {
                              alert(data.message);

                              fetch(`http://localhost:5000/api/v1/retrieve-friend-requests/?currentDev=${userSession}`)
                              .then(rsp=>rsp.json())
                              .then(data=>{
                                setfriendrequest(data.developers);
                                setNumberOfFriendRequest(data.no_of_requests);
                              })

                              fetch(`http://localhost:5000/api/v1/get_dashboard_numbers/?userId=${userSession}`)
                              .then( rsp => rsp.json())
                              .then( data => {
                                let statistics=data
                                setTotalProjects(statistics.total_projects);
                                setOutstandingBugs(statistics.bugs_outstanding);
                                setAverageBugs(statistics.average_bugs);
                                setFriends(statistics.friends);
                              })
                            })
                          }}><i className="fa-solid fa-check"></i></button>
                        </td>

                        <td key={`rejectRequest${dev.dev_id}`}>
                          <button className="btn btn-danger btn-sm" id={`btnSendRequest${dev.dev_id}`} onClick={()=>{

                            fetch(`http://localhost:5000/api/v1/reject-friend-request/?invitee=${userSession}&invited=${dev.dev_id}`)
                            .then( rsp => rsp.json())
                            .then( data => {
                              alert(data.message);
                              
                              fetch(`http://localhost:5000/api/v1/retrieve-friend-requests/?currentDev=${userSession}`)
                              .then(rsp=>rsp.json())
                              .then(data=>{
                                setfriendrequest(data.developers);
                                setNumberOfFriendRequest(data.no_of_requests);
                              })

                              fetch(`http://localhost:5000/api/v1/get_dashboard_numbers/?userId=${userSession}`)
                              .then( rsp => rsp.json())
                              .then( data => {
                                let statistics=data
                                setTotalProjects(statistics.total_projects);
                                setOutstandingBugs(statistics.bugs_outstanding);
                                setAverageBugs(statistics.average_bugs);
                                setFriends(statistics.friends);
                              })
                            })
                          }}><i className="fa-solid fa-xmark"></i></button>
                        </td>
                        
                      </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}


export default Dashboard