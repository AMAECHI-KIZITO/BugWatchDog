import React, {useState,useEffect} from "react"





function Dashboard({userSession}){
  const [totalProjects, setTotalProjects]=useState(0)
  const [outstandingBugs, setOutstandingBugs]=useState(0)
  const [averageBugs, setAverageBugs]=useState(0)


  useEffect( () => {
    fetch(`http://localhost:5000/api/v1/get_dashboard_numbers/?userId=${userSession}`)
    .then( rsp => rsp.json())
    .then( data => {
      let statistics=data
      setTotalProjects(statistics.total_projects);
      setOutstandingBugs(statistics.bugs_outstanding);
      setAverageBugs(statistics.average_bugs);
    })
    .catch((error)=> console.log(error))

  }, [])



  return(
    <>
      <div className="row dashboardlinks">

        <div className="col-md-11">
          <div className="row" style={{minHeight:"400px", alignItems:'center', color:"white"}}>
            <div className="dashboardInfo col-md-4">
              <h4 className="text-center">Total Projects</h4>
              <p className="text-center">{totalProjects}</p>
            </div>
            <div className="dashboardInfo col-md-4">
              <h4 className="text-center">Bugs Outstanding</h4>
              <p className="text-center">{outstandingBugs}</p>
            </div>
            <div className="dashboardInfo col-md-4">
              <h4 className="text-center">Average Bugs per Project</h4>
              <p className="text-center">{averageBugs}</p>
            </div>
          </div>
        </div>
        
      </div>
    </>
  )
}


export default Dashboard