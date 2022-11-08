import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";


const SingleProject= () => {
    const {projectId}=useParams()
    const[specificProject, setSpecificProject]=useState([])


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/find/project/?projectId=${projectId}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let api_data=data.dev_projects[0];
            let feedback=Object.values(api_data);
            setSpecificProject(feedback)
        })
    },[])



    return(
        <>
            <h2 style={{color:"gold"}}>{specificProject[3]}</h2><hr/>
            <div className="row">
                <div className="col-md-11 specificProjectDetails">
                    <p>{specificProject[1]}</p>
                    <p>Date Created: {specificProject[0]}</p>
                </div>
            </div><br/>

            <div className="row">
                <div className="col-md-11">
                    <Link to="/dashboard/myprojects">
                        <button className="btn btn-warning btn-sm float-end">
                            <i className="fa-solid fa-chevron-left" style={{fontSize:"12px"}}></i> Back
                        </button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default SingleProject