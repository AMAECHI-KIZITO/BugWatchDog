import React,{useState, useEffect} from "react"
import { Link } from "react-router-dom"


const Viewprojects=({userSession})=>{
    const [allDevProjects, setAllDevProjects]=useState([])


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/view-projects/${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setAllDevProjects(data.dev_projects)
        })
    },[])

    
    return(
        <>
            <div className="row">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 style={{color:"gold"}}>My Projects</h2>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>S/N</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                        <th className="d-none d-md-block">Created</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(allDevProjects).map(creation=> 
                                        <tr>
                                            <td key={creation.project_id}>{creation.project_id}</td>
                                            <td key={creation.project_name}>{creation.project_name}</td>
                                            <td key={creation.project_description}>{creation.project_description}</td>
                                            <td key={creation.date_created} className="d-none d-md-block">{creation.date_created}</td>
                                            <td key={`viewProject${creation.project_id}`}>
                                                <Link to={`/dashboard/myprojects/${creation.project_id}`}>
                                                    <button className="btn btn-sm btn-warning">View</button>
                                                </Link>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Viewprojects