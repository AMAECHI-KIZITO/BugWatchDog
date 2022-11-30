import React, {useEffect, useState} from "react"



function Newgroup({userSession}){
    const[myFriends, setMyFriends]=useState([])
    const[groupMembers, setGroupMembers]=useState([])
    const[groupMembersNames, setGroupMembersNames]=useState([])

    // let selectedMembers=[]

    // if (groupMembers.length > 0){
    //     for(let x in groupMembers){
    //         fetch(`http://localhost:5000/api/v1/get-developer-profile/${x}/`)
    //         .then(rsp=>rsp.json())
    //         .then(data=>{
    //             selectedMembers.push(data.information.dev_name)
    //         })
    //     }
    // }
    
    //get my friends
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-friends/?currentDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setMyFriends(data.developers);
        })
    },[])


    return(
    <>
        <div className="row dashboardlinks">
            <div className="col-md-11">
                <div className="row">
                    <div className="col-12">
                        <h2 className="ms-1" style={{color:"gold"}}>New Group</h2>
                        <p className='mb-3 ms-1 text-light'>Add participants</p><hr/>
                    </div>

                    <div className="col-12">
                        {groupMembers.length>0 ? 
                        <>
                            {/*{groupMembers.map(value=>
                                fetch(`http://localhost:5000/api/v1/get-developer-profile/${value}/`)
                                .then(rsp=>rsp.json())
                                .then(data=>{
                                    console.log(data)
                                })    
                            )}*/}
                            <p className='text-light ms-2'>{groupMembers.join(' ')}</p> 
                        </>
                        :
                        <span></span>
                        }
                    </div>

                    <div className="col-12">
                        {(typeof myFriends==="string")?(
                            <div className="row align-items-center" style={{minHeight:'400px'}}>
                                <div className="col">
                                    <h4 className="text-center" style={{color:"grey"}}>Ouch <i className='fa-solid fa-heart-crack text-danger'></i></h4>
                                    <p className="text-center" style={{color:"grey"}}>You haven't made any friends yet. To create a group, you'd need friends.</p>
                                </div>
                            </div>
                        ):(
                            <>
                                {
                                    myFriends.map(friend=>
                                        <>
                                            <div className='row mb-4' key={friend.serial_no} onClick={
                                                
                                                groupMembers.includes(friend.dev_id) 
                                                ?

                                                ()=>setGroupMembers(groupMembers => groupMembers.filter(member=>member!== friend.dev_id))

                                                : 
                                                ()=>setGroupMembers(groupMembers => groupMembers.concat(friend.dev_id))}>

                                                <div className="col-12">
                                                    <div className="float-start mx-2">
                                                        <i className="fa-solid fa-user text-warning float-start fa-3x me-2"></i>
                                                    </div>
                                                    <div>
                                                        <span className="text-light">{friend.dev_nickname[0].toUpperCase()  + friend.dev_nickname.substring(1)}</span>
                                                        <p className="text-light" style={{fontSize:'10px'}}>
                                                            {friend.dev_stack}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </>
                                    )
                                }
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}


export default Newgroup