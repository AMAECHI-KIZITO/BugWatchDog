import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const Inboxmessage= ({userSession}) => {
    const {msg}=useParams()
    const navigate=useNavigate()

    const[specificMessage, setSpecificMessage]=useState([])
    const[senderName, setSenderName]=useState('')


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox-details/${msg}/?loggedInDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setSenderName(data.senderName[0].toUpperCase() + data.senderName.substring(1));
            setSpecificMessage(data.details);
            console.log(data);
        })
    }, [])



    return(
        <>
            {(typeof senderName === 'undefined')?(
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ):(
                <>
                    <div>
                        <div className="float-start me-1">
                            <i className="fa-solid fa-arrow-left text-warning" onClick={()=>navigate(-1)}></i>
                        </div>
                        <div className="mx-2">
                            <i className="fa-solid fa-user text-warning float-start fa-2x me-2"></i>
                        </div>
                        <h3 style={{color:"gold"}}>{senderName}</h3>
                    </div><hr/>

                    <div className="row" style={{minHeight:"400px"}}>
                        <div className="col-md-11" id="messageSection">
                            {specificMessage.map((msgRecord) =>
                                {
                                    if(userSession==msgRecord.senderId){
                                        return <p className="col-6 offset-6 py-2 px-1" id="messageSentByMe">{msgRecord.message}</p>
                                    }
                                    return <p className="col-6 py-2 px-1" style={{color:"white"}} id="messageSentByThem">{msgRecord.message}</p>
                                }
                            )}
                        </div>
                    </div>
                    <div className="row mx-1" style={{position:"sticky", bottom:"0px"}}>
                        <div className="col-md-11">
                            <form>
                                <div className="input-group mb-2">
                                    <input className="form-control" style={{backgroundColor:"inherit", color:"white", borderRadius:"30px"}} placeholder="Message Here"/>
                                    <button type="button" className="input-group-text btn btn-warning" style={{borderRadius:"50%"}}>
                                        <i className="fa-regular fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Inboxmessage