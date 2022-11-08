import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";


function Addbug({userSession}){
    const navigate=useNavigate()

    const [projects, setProjects]=useState('')
    const [bugDescription, setBugSummary]=useState('')
    const [affectedProject, setAffectedProject] = useState("#")

    useEffect(() => {
        fetch(`http://localhost:5000/api/v1/fetch-user-projects/?userId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let projectInformation=data;
            setProjects(projectInformation.projects_list);
            //console.log(projects)
        })
    },[bugDescription])


    const describeBug=(event)=>setBugSummary(event.target.value)
    const chooseAffectedProject=(event)=>setAffectedProject(event.target.value)
    
    const submitBug=(event)=>{
        event.preventDefault();
        if(!bugDescription ||!affectedProject || affectedProject=="#"){
            alert('Invalid Project Selection');
            return;
        }
        let bugData={
            bugDescription,affectedProject
        }

        fetch("http://localhost:5000/api/v1/create-new-bug/",{
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"http://localhost:5000/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(bugData)
        })
        .then(resp=> {
            if(resp.status=="200"){
                alert('Bug Issue Created');
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
                            <h2 className="mb-3" style={{color:"gold"}}>Create Bug</h2><hr/>
                            <form onSubmit={submitBug}>
                                <div className="mb-3 mt-3">
                                    <label htmlFor="bugdescription" style={{color:"gold"}}>Bug Description</label>
                                    <textarea className='form-control' name='bugdescription' onBlur={describeBug}></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="bugName" style={{color:"gold"}}>Affected Project</label>
                                    <select className="form-select" onChange={chooseAffectedProject}>
                                        <option value="#">Choose the affected project</option>
                                        {Object.values(projects).map(project => <option value={project.project_id} key={project.project_id}>{project.project_name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <button className="btn" id="btnCreateBug" style={{backgroundColor:"gold"}}>Create</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Addbug