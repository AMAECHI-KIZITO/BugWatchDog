import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const Inboxmessage= ({userSession}) => {
    const {msg}=useParams();
    const navigate=useNavigate();

    const[specificMessage, setSpecificMessage]=useState([]);
    const[senderName, setSenderName]=useState('');
    const[profileData, setProfileData]=useState({});

    //sending a new message variables
    const[message,setNewMessage]=useState(null);
    const[msgStatus, setMsgStatus]=useState(0);
    let receiver=msg;

    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox-details/${msg}/?loggedInDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setSenderName(data.senderName[0].toUpperCase() + data.senderName.substring(1));
            setSpecificMessage(data.details);
        })
    }, [msgStatus])

    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-developer-profile/${msg}/`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setProfileData(data);
        })
    }, [])
    

    const content=(event)=>{
        if(msgStatus==0){
            setNewMessage(event.target.value);
        }
        setMsgStatus(0);
        setNewMessage(event.target.value);
    }



    //send a new message
    const sendMessage=(event)=>{
        event.preventDefault();
        
        if(!message || message.trim().length==0){
            alert("Nothing to send.")
            return;
        }

        let messageData={
            message,receiver,userSession
        }
        

        fetch("http://localhost:5000/api/v1/sendmessage/",{
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"http://localhost:5000/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(messageData)
        })
        .then(resp=> {
            if(resp.status >=  200 && resp.status <=299){
                setMsgStatus(1);
                document.getElementById("writeMessage").value="";
            }
        })
    }

    return(
        <>
            {(typeof senderName === 'undefined')?(
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ):(
                <>
                    <div>
                        <div className="float-start me-1 ms-1">
                            <i className="fa-solid fa-arrow-left text-warning" onClick={()=>navigate(-1)}></i>
                        </div>
                        <div className="mx-2">
                            <i type='button' className="fa-solid fa-user text-warning float-start fa-2x me-2" data-bs-toggle="modal" data-bs-target="#viewProfile"></i>
                        </div>
                        <h3 type='button' style={{color:"gold"}} data-bs-toggle="modal" data-bs-target="#viewProfile">{senderName}</h3>
                    </div><hr/>

                    <div className="row">
                        <div className="col-md-11" style={{height:"400px"}} id="messageSection">
                            {specificMessage.map((msgRecord) =>
                                {
                                    if(userSession==msgRecord.senderId){
                                        return <div className='mb-4'><p  className="col-10 offset-2 py-2 px-3" id="messageSentByMe">{msgRecord.message}</p> <p className="float-end" style={{fontSize:"8px"}} id="messageSentByMeTimeStamp">{msgRecord.timestamp}</p></div>
                                    }
                                    return <><p className="col-10 py-2 px-3 ms-1" style={{color:"white"}} id="messageSentByThem">{msgRecord.message}</p> <p style={{fontSize:"8px"}} id="messageSentByThemTimeStamp" className='ms-1'>{msgRecord.timestamp}</p></>
                                }
                            )}
                        </div>
                    </div>
                    <div className="row mx-1" style={{position:"sticky", bottom:"0px",backgroundColor:'#05204a'}}>
                        <div className="col-md-11">
                            <form>
                                <div className="input-group mb-2">
                                    <input className="form-control" style={{backgroundColor:"inherit", color:"white", borderRadius:"30px"}} placeholder="Message Here" onChange={content} id="writeMessage"/>
                                    <button className="input-group-text btn btn-warning" style={{borderRadius:"50%"}} onClick={sendMessage}>
                                        <i className="fa-regular fa-paper-plane"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </>
            )}

            
            <div className="row">
                <div className="col">
                    <div className="modal fade" id="viewProfile" tabIndex="-1" aria-labelledby="viewProfileLabel" aria-hidden="true" data-bs-backdrop='static' data-bs-keyboard='false'>
                        <div className="modal-dialog modal-fullscreen-md-down">
                            <div className="modal-content"  style={{backgroundColor:'gold'}}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className='col-12'>
                                            <button type="button" className="btn-close float-end" data-bs-dismiss="modal" aria-label="Close"></button><br/>
                                            <h5 className="modal-title text-center mb-2" id="viewProfileLabel"><i className="fa-solid fa-user fa-3x"></i></h5>
                                        </div>
                                        {
                                            (typeof profileData.information === 'undefined')?(
                                                <div className="spinner-border text-warning" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ):(
                                                <>
                                                    <div className="col-12">
                                                        <h4 className="text-center">{profileData.information.dev_name[0].toUpperCase() + profileData.information.dev_name.substring(1)}</h4>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div><hr id='profileHorizontalLine'/>

                                    <div className="row">
                                        {
                                            (typeof profileData.information === 'undefined')?(
                                                <div className="spinner-border text-warning" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ):(
                                                <>
                                                    <div className="col">
                                                        <p><b>Stack: </b>{profileData.information.dev_stack}</p>
                                                        <p><b>Joined: </b>{profileData.information.date_reg}</p>
                                                        <p><b>Email: </b>{profileData.information.dev_email}</p>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inboxmessage