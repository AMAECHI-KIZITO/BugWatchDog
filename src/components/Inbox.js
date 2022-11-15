import React, {useEffect, useState} from "react"
import { format, isSameDay, isSameWeek, isSameYear } from "date-fns"
import { Link } from "react-router-dom";


const Inbox=({userSession})=>{
    const [senders, setSenders]=useState([]);
    const [sendersIdentityNumber, setSendersIdentityNumber]=useState([]);
    const [myInbox, setMyInbox]=useState([]);
    const [timeDelivered, setTimeDelivered]=useState([]);


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox/?devId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            if(data.status!=false){
                setSenders(data.names);
                setMyInbox(data.message);
                setTimeDelivered(data.timestamp);
                setSendersIdentityNumber(data.list_of_senders);
            }else{
                setMyInbox(data.message);
            }
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
                                    {
                                        senders.map( (value,key)=>(
                                            <>
                                                <Link to={`/dashboard/inbox/${sendersIdentityNumber[key]}`} style={{textDecoration:'None'}}  key={key}>
                                                    <div className="row mb-1" style={{color:"white"}}>
                                                        <div classname="col-12">
                                                            <div className="float-start mx-2">
                                                                <i className="fa-solid fa-user text-warning float-start fa-3x me-2"></i>
                                                            </div>
                                                            <div>
                                                                <span>
                                                                    {value[0].toUpperCase()  + value.substring(1)}
                                                                </span>

                                                                <span style={{fontSize:"9px"}} className="float-end pe-3">
                                                                    {timeDelivered[key]}
                                                                </span>
                                                                <p style={{fontSize:"12px"}}>{myInbox[key][0].toUpperCase()  + myInbox[key].substring(1)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
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