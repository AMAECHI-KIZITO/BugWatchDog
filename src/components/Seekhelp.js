import React, {useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"

const Seekhelp=({userSession})=>{
    const navigate=useNavigate()
    const [availableDevelopers, setAvailableDevelopers]=useState([])
    const [message, setMessage]=useState(null)
    const [receiver, setReceiver]=useState("")

    const messageRecipient=(userId)=>{
        setReceiver(userId)
    }
    const messageContent=(event)=>{
        setMessage(event.target.value)
    }
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/developers/?currentDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setAvailableDevelopers(data.developers);
        })
    },[])

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
        if(resp.status=="200"){
            alert('Message Sent');
            setMessage(null);
        }
        })
    }

    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3 ms-1" style={{color:"gold"}}>Ask For Help</h2><hr/>
                            
                            {(typeof availableDevelopers==="string")?(
                                <h2 style={{color:"white"}}>No Developers Available</h2>
                            ):(
                                <>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>S/N</th>
                                                <th>Developer</th>
                                                <th>Tech Stack</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.values(availableDevelopers).map(dev => 
                                                <tr>
                                                    <td key={dev.serial_no}>{dev.serial_no}</td>
                                                    <td key={dev.dev_nickname}>{dev.dev_nickname}</td>
                                                    <td key={`stack ${dev.dev_stack}`}>{dev.dev_stack}</td>
                                                    <td key={`message${dev.dev_id}`}><button className="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#sendMessage" onClick={()=>messageRecipient(dev.dev_id)}>Message</button></td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="modal fade" id="sendMessage" tabIndex="-1" aria-labelledby="sendMessageLabel" aria-hidden="true" data-bs-backdrop='static' data-bs-keyboard='false'>
                                <div className="modal-dialog modal-md modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="sendMessageLabel">Send Message</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <form>
                                                <div className='mb-2'>
                                                    <label><b>Type your message</b></label>
                                                    <textarea className="form-control" name="messageContent" onChange={messageContent}></textarea>
                                                </div>
                                                <div className='mb-2'>
                                                    <input type="hidden" className="form-control" value={receiver} readOnly/>
                                                </div>
                                                <div>
                                                    <button className="btn btn-warning btn-sm float-end" onClick={sendMessage}>
                                                        <i className="fa-regular fa-paper-plane"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
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

export default Seekhelp