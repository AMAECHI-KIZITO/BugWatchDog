import React, {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";


function Addbug({userSession}){
    const navigate=useNavigate();
    const [projects, setProjects]=useState('');
    const [bugDescription, setBugSummary]=useState('');
    const [affectedProject, setAffectedProject] = useState("#");
    const [codeSnippet, setCodeSnippet] = useState('');
    const [codeImageExt, setCodeImageExt] = useState('');
    document.title='BugWatch - Add Bug';

    //get existing projects
    useEffect(() => {
        fetch(`https://bugwatch.com.ng/api/v1/fetch-user-projects/?userId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let projectInformation=data;
            setProjects(projectInformation.projects_list);
        })
    },[])

    // const imageChoice=(event)=>{
    //     setCodeSnippet(event.target.value);
    // }
    
    const submitBug=(event)=>{
        event.preventDefault();
        if(!bugDescription ||!affectedProject || affectedProject=="#"){
            alert('Form data required');
            return;
        }
        let bugData={
            bugDescription,affectedProject
        }

        fetch("https://bugwatch.com.ng/api/v1/create-new-bug/",{
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"https://bugwatch.com.ng/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(bugData)
        })
        .then(response => response.json())
        .then(data => {
            alert('Bug Issue Created');
            navigate("/dashboard");
        });
        // .then(resp=> {
        //     if(resp.status >=  200 && resp.status <=299){
        //         alert('Bug Issue Created');
        //         navigate("/dashboard")
        //     }
        // })
    }

    
    
    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3 ms-1" style={{color:"gold"}}>Create Bug</h2><hr/>
                            
                            <form onSubmit={submitBug} encType='multipart/form-data'>
                                <div className="mb-3 mt-3">
                                    <label htmlFor="bugdescription" style={{color:"gold"}} className="ms-1 form-label">Bug Description</label>
                                    <textarea className='form-control' name='bugdescription' onBlur={(event)=>setBugSummary(event.target.value)}></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="affectedProject" style={{color:"gold"}} className="ms-1 form-label">Affected Project</label>
                                    <select className="form-select" onChange={(event)=>setAffectedProject(event.target.value)} name="affectedProject" id='affectedProject'>
                                        <option value="#">Choose the affected project</option>
                                        {Object.values(projects).map(project => <option value={project.project_id} key={project.project_id}>{project.project_name}</option>)}
                                    </select>
                                </div>

                                {/*<div className="mb-3">
                                    <label htmlFor="bugCodeSnippet" style={{color:"gold"}} className="ms-1 form-label">Upload code snippet screenshot</label>
                                    <input type="file" className="form-control" name="codeSnippet" id='bugCodeSnippet' onChange={imageChoice}/>
                                    <p style={{color:'white'}}>{codeSnippet}</p>
                                </div>*/}

                                <div>
                                    <button className="btn ms-1" id="btnCreateBug" style={{backgroundColor:"gold"}}>Create</button>
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