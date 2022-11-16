import React, {useState, useEffect} from "react"
import {Link, Outlet} from "react-router-dom"


function SharedDashboardLinks({user,userSession, setUser, setUserSession}){
  const clearSession=()=>setUserSession(null);
  const clearUser=()=>setUser(null);

  const logout=()=>{
    clearSession();
    clearUser();
  }


  return(
    <>
      <div className="row">
        <div className="col-12">
          <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
              <a className="navbar-brand">DEBUGGER <i className="fa-solid fa-bugs"></i></a>
              <button className='btn btn-success btn-lg float-end d-md-none' type="button" data-bs-toggle="offcanvas" data-bs-target="#debuggerAppLinks" aria-controls="debuggerAppLinks" style={{backgroundColor:"gold"}}>
                <i className="fa-solid fa-bars"></i>
              </button>
            </div>
          </nav>
        </div>

        <div className="col-md-11" style={{color:"gold"}}>
          <p className="float-end pe-3" style={{fontSize:"13px"}}>Hi, {user[0].toUpperCase() + user.substring(1)} <i className="fa-solid fa-smile"></i></p><br/>
        </div>
      </div>




      <div className="row dashboardlinks">

        <div className="col-md-3 d-none d-md-block" id="dashboardNav">

          <p className="text-center"><Link to="/dashboard" className="quickDashboardLinks">Dashboard</Link></p><br/>
          <p className="text-center"><Link to="/dashboard/newproject" className="quickDashboardLinks">New Project</Link></p><br/>
          <p className="text-center"><Link to="/dashboard/myprojects" className="quickDashboardLinks">View Projects</Link></p><br/>
          <p className="text-center"><Link to="/dashboard/addbug" className="quickDashboardLinks">Add Bug</Link></p><br/>
          <p className="text-center"><Link to="/dashboard/inbox" className="quickDashboardLinks">Inbox</Link></p><br/>
          <p className="text-center"><Link to="/dashboard/creategroup" className="quickDashboardLinks">Create Group</Link></p><br/>
          <p className="text-center"><Link to="/dashboard/seekhelp" className="quickDashboardLinks">Find Help</Link></p><br/>
          <p className="text-center"><button className="btn btn-warning btn-sm" onClick={logout}>Logout</button></p>

        </div>


        


        <div className="col-md-9">
          <Outlet/>
        </div>
      </div>


      <div id="OffcanvasSection">
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="debuggerAppLinks" aria-labelledby="debuggerApp" style={{backgroundColor:"#05204a"}}>

          
          <div className="offcanvas-header">
            <h5 id="debuggerApp" className="text-light">Quick Links <i className="fa-solid fa-bugs"></i></h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
          </div>


          <div className="row offcanvas-body">
            <p className="text-center"><Link to="/dashboard" className="quickDashboardLinks text-warning">Dashboard</Link></p>
            <p className="text-center"><Link to="/dashboard/newproject" className="quickDashboardLinks text-warning">New Project</Link></p>
            <p className="text-center"><Link to="/dashboard/myprojects" className="quickDashboardLinks text-warning">View Projects</Link></p>
            <p className="text-center"><Link to="/dashboard/addbug" className="quickDashboardLinks text-warning">Add Bug</Link></p>
            <p className="text-center"><Link to="/dashboard/inbox" className="quickDashboardLinks text-warning">Inbox</Link></p>
            <p className="text-center"><Link to="/dashboard/creategroup" className="quickDashboardLinks text-warning">Create Group</Link></p>
            <p className="text-center"><Link to="/dashboard/seekhelp" className="quickDashboardLinks text-warning">Find Help</Link></p>
            <p className="text-center"><button className="btn btn-warning btn-sm" onClick={logout}>Logout</button></p>
          </div>
        </div>
      </div>
    </>
  )
}


export default SharedDashboardLinks