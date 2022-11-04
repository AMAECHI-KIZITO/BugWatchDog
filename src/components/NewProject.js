import React, {useState, useEffect} from "react"

function Newproject(){
  const [projectname, setProjectname]=useState(null)
  const [projectsummary, setProjectsummary]=useState(null)
  return(
    <>
      <div className="row dashboardlinks">

        <div className="col-12">
          <div className="row">
            <div className="col-12">
                <form>
                    <div className="mb-3">
                        <label htmlFor="projectname" style={{color:"gold"}}>Project Name</label>
                        <input type='text' className="form-control py-3" name="projectname" id="projectname" placeholder="Enter project name"/>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="projectdescription" style={{color:"gold"}}>Project Description</label>
                        <textarea className='form-control' name='projectdescription'></textarea>
                    </div>

                    <div>
                        <button className="btn" id="btnCreateNewProject" style={{backgroundColor:"gold"}}>Create</button>
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