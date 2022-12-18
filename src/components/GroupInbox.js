import React, {useEffect, useState} from "react"
import { Link } from "react-router-dom";


const GroupInbox=({userSession})=>{
    const [myInbox, setMyInbox]=useState([]);
    const [loadingStatus, setLoadingStatus]=useState("Loading");

    //Getting my groups inbox
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/group-inbox/?devId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setMyInbox(data.message);
            setLoadingStatus('Loaded');
            document.title='Debugger - Group Inbox';
            //console.log(data);
        })
    },[])

    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3 ms-1" style={{color:"gold"}}>Group Inbox</h2><hr/>

                            {(loadingStatus === "Loading")?(
                                <div className="row" style={{minHeight:"350px", alignItems:"center"}}>
                                    <div className="text-center">
                                        <div className="spinner-border text-warning" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                </div>
                            ):(
                                <>
                                    {
                                        typeof myInbox === "string"

                                        ?
                                        <div className="row" style={{minHeight:"300px", alignItems:"center"}}>
                                            <div className="col-12 text-center" style={{color:"grey"}}>
                                                <h3>Group Inbox Empty</h3>
                                                <p>Start a group chat by clicking below</p>

                                                <Link to={`/dashboard/creategroup`} style={{textDecoration:'None'}}>
                                                    <button className="btn btn-warning btn-lg" style={{borderRadius:"50%"}} type="button">
                                                        <i className="fa-solid fa-people-group"></i>
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                        :
                                        myInbox.map(info=>
                                            <>
                                                <Link to={`/dashboard/groupinbox/${info.id}`} key={info.id} style={{textDecoration:'None'}}>
                                                    <div className="row mb-1" style={{color:"#fff"}} key={info.id}>
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <div className="col-12">
                                                                    <h4 className=" ms-1">
                                                                        {info.groupname} 
                                                                        <span className="float-end" style={{fontSize:"11px"}}>
                                                                            {info.last_message_timestamp}
                                                                        </span>
                                                                    </h4>
                                                                </div>
                                                                <div className="col-12">
                                                                    <p className=" ms-1" style={{color:'#AAAAAA', fontSize:'13px'}}>{info.last_message_sender[0].toUpperCase()  + info.last_message_sender.substring(1)}: {info.last_message}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>

                                                <Link to={`/dashboard/creategroup`} style={{textDecoration:'None'}}>
                                                    <button className="btn btn-warning float-end me-2" style={{borderRadius:"50%", position:'sticky', bottom:'0px'}} type="button">
                                                    <i className="fa-solid fa-people-group"></i>
                                                    </button>
                                                </Link>
                                            </>
                                        )
                                    }
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GroupInbox