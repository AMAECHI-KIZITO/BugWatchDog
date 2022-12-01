import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const ViewSingleProjectBugs= ({userSession}) => {
    const {projectId} = useParams()
    const[specificProject, setSpecificProject]=useState([])
    const[specificProjectBugs, setSpecificProjectBugs]=useState([])
    const[loadData, setLoadData]=useState("loading")


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/find/project/?projectId=${projectId}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let api_data=data.dev_projects[0];
            let feedback=Object.values(api_data);
            setSpecificProject(feedback);
        })
    },[])
   
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-project-bugs/${projectId}/`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setSpecificProjectBugs(data.bugRecords);
            setLoadData("loaded");
            console.log(data);
        })
    },[])


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
                                                <td><button className="btn btn-outline-warning btn-sm"><i className="fa-solid fa-pen"></i></button></td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </table>
                        }
                    </div>
                </div>
            
            }
            
        </>
    )
}

export default ViewSingleProjectBugs