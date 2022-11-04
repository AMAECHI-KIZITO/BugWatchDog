import React, {useState, useEffect} from "react"
function Dashboard(){
  
  return(
    <>
      <div className="row dashboardlinks">

        <div className="col-12">
          <div className="row">
            <div className="dashboardInfo col-md-4">
              <h4 className="text-center">Total Projects</h4>
              <p className="text-center">500</p>
            </div>
            <div className="dashboardInfo col-md-4">
              <h4 className="text-center">Bugs Outstanding</h4>
              <p className="text-center">5</p>
            </div>
            <div className="dashboardInfo col-md-4">
              <h4 className="text-center">Average Bugs per Project</h4>
              <p className="text-center">2.12</p>
            </div>
          </div>
        </div>
        
      </div>
    </>
  )
}


export default Dashboard