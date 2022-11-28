import React, {useEffect, useState} from "react"
import { format, isSameDay, isSameWeek, isSameYear } from "date-fns"
import { Link } from "react-router-dom";


const Inbox=({userSession})=>{
    const [availableDevelopers, setAvailableDevelopers]=useState([])
    const [senders, setSenders]=useState([]);
    const [sendersIdentityNumber, setSendersIdentityNumber]=useState([]);
    const [myInbox, setMyInbox]=useState([]);
    const [timeDelivered, setTimeDelivered]=useState([]);

    //getting the inbox
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
    
    //Getting all developers
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-friends/?currentDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setAvailableDevelopers(data.developers);
        })
    },[])


    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3 ms-1" style={{color:"gold"}}>Inbox</h2><hr/>

                            {(typeof myInbox === "string")?(
                                <div className="row" style={{minHeight:"300px", alignItems:"center"}}>
                                <div className="col-12 text-center" style={{color:"grey"}}>
                                    <h3>Inbox Empty</h3>
                                    <p>Start a chat by clicking below</p>

                                    <button className="btn btn-warning btn-lg" style={{borderRadius:"50%"}} type="button" data-bs-toggle="offcanvas" data-bs-target="#developersContact" aria-controls="developersContactList">
                                        <i className="fa-regular fa-comment"></i>
                                    </button>
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
                                                                <p style={{fontSize:"12px"}}>{myInbox[key]}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </>
                                        ))
                                    }
                                    <button className="btn btn-warning float-end me-2" style={{borderRadius:"50%", position:'sticky', bottom:'0px'}} type="button" data-bs-toggle="offcanvas" data-bs-target="#developersContact" aria-controls="developersContactList">
                                        <i className="fa-regular fa-comment"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div id="OffcanvasSection">
                <div className="offcanvas offcanvas-end" tabIndex="-1" id="developersContact" aria-labelledby="developersContactList" style={{backgroundColor:"#05204a"}}>

                
                    <div className="offcanvas-header">
                        <h5 id="developersContacts" className="text-light">Start a conversation<i className="fa-solid fa-user-group"></i></h5>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
                    </div><hr/>


                    <div className="row offcanvas-body">
                        <div className="col-12">
                            {(typeof availableDevelopers==="string")?(
                                <div className="row align-items-center" style={{minHeight:'400px'}}>
                                    <div className="col">
                                        <h4 className="text-center" style={{color:"grey"}}>Ouch <i className='fa-solid fa-heart-crack text-danger'></i></h4>
                                        <p className="text-center" style={{color:"grey"}}>You haven't made any friends yet</p>
                                    </div>
                                </div>
                            ):(
                                <>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>S/N</th>
                                                <th>Developer</th>
                                                <th>Stack</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(availableDevelopers).map(dev => 
                                                <tr>
                                                    <td key={dev.serial_no}>{dev.serial_no}</td>
                                                    <td key={dev.dev_nickname}>{dev.dev_nickname[0].toUpperCase()  + dev.dev_nickname.substring(1)}</td>
                                                    <td key={`stack ${dev.dev_stack}`}>{dev.dev_stack}</td>
                                                    <td key={`message${dev.dev_id}`}>
                                                        <Link to={`/dashboard/inbox/${dev.dev_id}`} style={{textDecoration:'None'}}>
                                                            <button className="btn btn-warning btn-sm">Msg</button>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inbox