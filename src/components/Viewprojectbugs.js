import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const ViewSingleProjectBugs= ({userSession}) => {
    const {projectId} = useParams();
    const[specificProject, setSpecificProject]=useState([]);
    const[specificProjectBugs, setSpecificProjectBugs]=useState([]);
    const[loadData, setLoadData]=useState("loading");
    const[updateBugId, setUpdateBugId]=useState(0);
    document.title='Debugger - View Project Bugs';

    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/find/project/?projectId=${projectId}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let api_data=data.dev_projects[0];
            let feedback=Object.values(api_data);
            setSpecificProject(feedback);
        })
    },[]);
   
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-project-bugs/${projectId}/`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setSpecificProjectBugs(data.bugRecords);
            setLoadData("loaded");
        })
    },[]);

    let bugData={
        updateBugId
    };

    const handleUpdate=(event)=>{
        event.preventDefault();
        fetch("http://localhost:5000/api/v1/update-bug-status/",{
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"http://localhost:5000/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(bugData)
        })
        .then( resp=> {
            if(resp.status=="200"){
                alert('Bug Status Updated');
                document.getElementById("closeUpdateModal").click();

                fetch(`http://localhost:5000/api/v1/get-project-bugs/${projectId}/`)
                .then(rsp=>rsp.json())
                .then(data=>{
                    setSpecificProjectBugs(data.bugRecords);
                    setLoadData("loaded");
                    //console.log(data);
                })
            }
        })
    };


    return(
        <>
            <h2 style={{color:"gold"}}>
                <span className="float-start me-3">
                    <Link to={`/dashboard/myprojects/${projectId}`}>
                        <button className="btn btn-warning btn-sm ms-1">
                            <i className="fa-solid fa-arrow-left" style={{fontSize:"12px"}}></i>
                        </button>
                    </Link>
                </span>
                {specificProject[3]} Bugs
            </h2> <hr/>

            
            {
                loadData === "loading" 
                
                ? 
                
                <div className="row align-items-center" style={{minHeight:'400px'}}>
                    <div className="text-center">
                        <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>

                
                :

                <div className="row">
                    <div className="col-md-11 specificProjectBugsDetails">

                        {
                            typeof specificProjectBugs === 'string'
                            ?
                            <div className="row align-items-center" style={{minHeight:'400px'}}>
                                <div className="col">
                                    <h4 className="text-center" style={{color:"grey"}}>No Bugs Logged Against This Project.</h4>
                                    <p className="text-center" style={{color:"grey"}}>Keep up the good work.</p>
                                    <p className="text-center"><i className="fa-solid fa-thumbs-up text-success fa-2x"></i></p>
                                </div>
                            </div>
                            :
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        specificProjectBugs.map(bug=>
                                            <tr key={bug.serial_no}>
                                                <td>{bug.serial_no}</td>
                                                <td>{bug.bug_name}</td>
                                                <td>{bug.bug_status}</td>

                                                {
                                                    bug.bug_status === "Unsolved" 
                                                    ?
                                                    <td>
                                                        <button className="btn btn-outline-warning btn-sm" data-bs-toggle="modal" data-bs-target="#changeBugStatus" onClick={()=>setUpdateBugId(bug.bug_id)}>
                                                            <i className="fa-solid fa-pen"></i>
                                                        </button>
                                                    </td>
                                                    :
                                                    <td>
                                                        <button className="btn btn-outline-success btn-sm" disabled>
                                                            <i className="fa-solid fa-check text-success"></i>
                                                        </button>
                                                    </td>
                                                }
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            }

            {/*Change bug status modal*/}
            <div className="modal fade" id="changeBugStatus" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Update Bug Status</h5>
                            <button type="button" className="btn-close" id="closeUpdateModal" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h6 className="text-center">Wow. Looks like you have found a way around this.</h6>
                            <p className="text-center">Please go ahead and update the status</p>

                            <form>
                                <div>
                                    <input type='hidden' value={updateBugId} size='1' readOnly/>
                                </div>
                                <div>
                                    <button className="col-4 offset-4 btn btn-warning" onClick={handleUpdate}>Update</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewSingleProjectBugs