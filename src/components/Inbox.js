import React, {useEffect, useState} from "react"
import { Link } from "react-router-dom"

const Inbox=({userSession})=>{
    const [myInbox, setMyInbox]=useState([])
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox/?devId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setMyInbox(data.message);
            //console.log(data);
        })
    },[])

    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3" style={{color:"gold"}}>Inbox</h2><hr/>

                            {(typeof myInbox === "string")?(
                                <div className="row" style={{minHeight:"300px", alignItems:"center"}}>
                                <div className="col-12 text-center" style={{color:"grey"}}>
                                    <h3>Inbox Empty</h3>
                                    <p>Start a chat by clicking below</p>
                                    <button className="btn btn-warning btn-lg" style={{borderRadius:"50%"}}><i className="fa-regular fa-comment"></i></button>
                                </div>
                                    
                            </div>
                            ):(
                                <div>
                                    {Object.values(myInbox).map(message=>
                                        <div className="row">
                                            <div className="col-12 py-3" style={{color:"white"}} key={message.message_sender}>
                                                <div className="float-start me-2">
                                                    <i className="fa-solid fa-user text-warning float-start fa-2x me-2" ></i>
                                                </div>
                                                {message.sender}
                                            </div>
                                        </div>
                                        
                                    )}
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