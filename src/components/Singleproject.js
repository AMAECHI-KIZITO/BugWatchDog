import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const SingleProject= ({userSession}) => {
    const {projectId} = useParams()
    const[specificProject, setSpecificProject]=useState([])


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/find/project/?projectId=${projectId}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let api_data=data.dev_projects[0];
            let feedback=Object.values(api_data);
            setSpecificProject(feedback);
        })
    },[])



    return(
        <>
            <h2 style={{color:"gold"}}>
                <span className="float-start me-3">
                    <Link to="/dashboard/myprojects">
                        <button className="btn btn-warning btn-sm ms-1">
                            <i className="fa-solid fa-arrow-left" style={{fontSize:"12px"}}></i>
                        </button>
                    </Link>
                </span>
                {specificProject[3]}
            
            </h2> <hr/>

            

            <div className="row">
                <div className="col-md-11 specificProjectDetails">
                    <p className="ms-1">{specificProject[1]}</p>
                    <p className="ms-1" style={{fontSize:'12px',color:'gold'}}><i className='fa-solid fa-calendar-days fa-2x'></i> {specificProject[0]}</p><br/>

                    <Link to={`/dashboard/myprojects/${specificProject[2]}/viewbugs`}>
                        <button className="btn btn-danger btn-sm float-end">View <i className="fa-solid fa-bug"></i></button>
                    </Link>
                    
                </div>
            </div>
        </>
    )
}

export default SingleProject