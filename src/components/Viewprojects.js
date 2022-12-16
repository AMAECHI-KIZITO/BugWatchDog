import React,{useState, useEffect} from "react"
import { Link } from "react-router-dom"


const Viewprojects=({userSession})=>{
    const [allDevProjects, setAllDevProjects]=useState([]);
    document.title='Debugger - View Project';

    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/view-projects/${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setAllDevProjects(data.dev_projects);
        })
    },[])

    
    return(
        <>
            <div className="row">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 style={{color:"gold"}} className="ms-1">My Projects</h2><hr/>

                            {(typeof allDevProjects==='string')?(
                                    <div className="row" style={{minHeight:"300px", alignItems:"center"}}>
                                        <div className="col-12 text-center" style={{color:"grey"}}>
                                            <h3>You haven't got any projects yet</h3>
                                            <p>Create a project by clicking below</p>
                                            <Link to="/dashboard/newproject"><button className="btn btn-warning btn-sm">Create Project</button></Link>
                                        </div>
                                            
                                    </div>
                                ):(
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>S/N</th>
                                                <th>Name</th>
                                                <th>Description</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(allDevProjects).map(creation=> 
                                                <tr>
                                                    <td key={creation.serial_no}>{creation.serial_no}</td>
                                                    <td key={creation.project_name}>{creation.project_name}</td>
                                                    <td key={creation.project_description}>{creation.project_description}</td>
                                                    <td key={`viewProject${creation.project_id}`}>
                                                        <Link to={`/dashboard/myprojects/${creation.project_id}`}>
                                                            <button className="btn btn-sm btn-warning">View</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Viewprojects