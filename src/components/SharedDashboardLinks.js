import React from "react"
import {Link, Outlet} from "react-router-dom"


function SharedDashboardLinks({user,userSession, setUser, setUserSession}){
  const clearSession=()=>setUserSession(null);
  const clearUser=()=>setUser(null);

  const logout=()=>{
    clearSession();
    clearUser();
  }

  const closeMenu=()=>{
    document.getElementById('closeMenuOffCanvas').click();
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




      <div className="row dashboardlinks" style={{minHeight:'500px'}}>

        <div className="col-md-3 d-none d-md-block" id="dashboardNav">

          <p className="text-center my-4"><Link to="/dashboard" className="quickDashboardLinks">Dashboard</Link></p>
          <p className="text-center my-4"><Link to="/dashboard/newproject" className="quickDashboardLinks">New Project</Link></p>
          <p className="text-center my-4"><Link to="/dashboard/myprojects" className="quickDashboardLinks">View Projects</Link></p>
          <p className="text-center my-4"><Link to="/dashboard/addbug" className="quickDashboardLinks">Add Bug</Link></p>
          <p className="text-center my-4"><Link to="/dashboard/inbox" className="quickDashboardLinks">Inbox</Link></p>
          <p className="text-center my-4"><Link to="/dashboard/groupinbox" className="quickDashboardLinks">Group Messages</Link></p>
          {/* <p className="text-center my-4"><Link to="/dashboard/creategroup" className="quickDashboardLinks">Create Group</Link></p> */}
          {/* <p className="text-center my-4"><Link to="/dashboard/seekhelp" className="quickDashboardLinks">Find Help</Link></p> */}
          <p className="text-center" style={{position:'sticky', bottom:'0px'}}><button className="btn btn-warning btn-sm" onClick={logout}>Logout</button></p>

        </div>


        


        <div className="col-md-9">
          <Outlet/>
        </div>
      </div>


      <div id="OffcanvasSection">
        <div className="offcanvas offcanvas-start" tabIndex="-1" id="debuggerAppLinks" aria-labelledby="debuggerApp" style={{backgroundColor:"#05204a"}}>

          
          <div className="offcanvas-header">
            <h5 id="debuggerApp" className="text-light">Quick Links <i className="fa-solid fa-bugs"></i></h5>
            <button type="button" id="closeMenuOffCanvas" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
          </div>


          <div className="row offcanvas-body">
            <p className="text-center"><Link to="/dashboard" className="quickDashboardLinks text-warning"  onClick={closeMenu}>Dashboard</Link></p>

            <p className="text-center"><Link to="/dashboard/newproject" className="quickDashboardLinks text-warning"  onClick={closeMenu}>New Project</Link></p>

            <p className="text-center"><Link to="/dashboard/myprojects" className="quickDashboardLinks text-warning"  onClick={closeMenu}>View Projects</Link></p>

            <p className="text-center"><Link to="/dashboard/addbug" className="quickDashboardLinks text-warning"  onClick={closeMenu}>Add Bug</Link></p>

            <p className="text-center"><Link to="/dashboard/inbox" className="quickDashboardLinks text-warning"  onClick={closeMenu}>Inbox</Link></p>

            <p className="text-center"><Link to="/dashboard/groupinbox" className="quickDashboardLinks text-warning"  onClick={closeMenu}>Group Messages</Link></p>

            {/* <p className="text-center"><Link to="/dashboard/creategroup" className="quickDashboardLinks text-warning">Create Group</Link></p> */}

            <p className="text-center"><Link to="/dashboard/seekhelp" className="quickDashboardLinks text-warning"  onClick={closeMenu}>Find Help</Link></p>

            <p className="text-center"><button className="btn btn-warning btn-sm" onClick={logout}>Logout</button></p>
          </div>
        </div>
      </div>
    </>
  )
}


export default SharedDashboardLinks