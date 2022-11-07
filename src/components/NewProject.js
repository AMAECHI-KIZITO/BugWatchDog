import React, {useState} from "react"
import { useNavigate } from "react-router-dom";


function Newproject({userSession}){
  const navigate=useNavigate()
  const [projectname, setProjectName]=useState(null);
  const [projectsummary, setProjectSummary]=useState(null);
  const [userId, setUserId]=useState(null);

  const nameProject=(event)=>{
    setProjectName(event.target.value);
    setUserId(userSession)
  }
  const describeProject=(event)=>setProjectSummary(event.target.value)

  const createProject=(e)=>{
    e.preventDefault();
    if(!projectname || !projectsummary || !userId) return;

    let projectData={
      projectname,projectsummary,userId
    }

    fetch("http://localhost:5000/api/v1/createnewproject/",{
      method:"POST",
      mode:'cors',
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":"http://localhost:5000/",
        "Access-Control-Allow-Credentials":true
      },
      body: JSON.stringify(projectData)
    })
    .then(resp=> {
      if(resp.status=="200"){
        alert('Project Added');
        navigate("/dashboard")
      }
    })
  }



  return(
    <>
      <div className="row dashboardlinks">
        <div className="col-md-11">
          <div className="row">
            <div className="col-12">

              <form onSubmit={createProject}>
                <div className="mb-3">
                  <label htmlFor="projectname" style={{color:"gold"}}>Project Name</label>
                  <input type='text' className="form-control py-3" name="projectname" id="projectname" placeholder="Enter project name" onChange={nameProject}/>
                </div>

                <div className="mb-3">
                  <label htmlFor="projectdescription" style={{color:"gold"}}>Project Description</label>
                  <textarea className='form-control' name='projectdescription' onChange={describeProject}></textarea>
                </div>

                <div>
                  <button className="btn" id="btnCreateNewProject" style={{backgroundColor:"gold"}}>Create Project</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}


export default Newproject