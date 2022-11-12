import React, {useEffect, useState} from "react"
import { Link } from "react-router-dom"

const Inbox=({userSession})=>{
    const [senders, setSenders]=useState([])
    const [myInbox, setMyInbox]=useState([])
    const [timeDelivered, setTimeDelivered]=useState([])
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox/?devId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setSenders(data.names);
            setMyInbox(data.message);
            setTimeDelivered(data.timestamp)
            console.log(data);
        })
    },[])

    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3" style={{color:"gold"}}>Inbox</h2><hr/>

                            {(typeof senders === "string")?(
                                <div className="row" style={{minHeight:"300px", alignItems:"center"}}>
                                <div className="col-12 text-center" style={{color:"grey"}}>
                                    <h3>Inbox Empty</h3>
                                    <p>Start a chat by clicking below</p>
                                    <button className="btn btn-warning btn-lg" style={{borderRadius:"50%"}}><i className="fa-regular fa-comment"></i></button>
                                </div>
                                    
                            </div>
                            ):(
                                <div>
                                    {
                                        senders.map( (value,key)=>(
                                            <>
                                                <div className="row mb-1" style={{color:"white"}} key={key}>
                                                    <div classname="col-12">
                                                        <div className="float-start mx-2">
                                                            <i className="fa-solid fa-user text-warning float-start fa-3x me-2"></i>
                                                        </div>
                                                        <div>
                                                            <span key={key}>{value[0].toUpperCase()  + value.substring(1)}</span>
                                                            <span style={{fontSize:"9px"}} className="float-end">{timeDelivered[key].toLocaleString("en-IN").split(' ')[4]}</span>
                                                            <p style={{fontSize:"12px"}}>{myInbox[key]}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inbox