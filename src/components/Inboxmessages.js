import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


const Inboxmessage= () => {
    const {msg}=useParams()
    const[specificMessage, setSpecificMessage]=useState([])
    const[senderName, setSenderName]=useState('')


    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox-details/${msg}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setSenderName(data.senderName[0].toUpperCase() + data.senderName.substring(1))
            console.log(data)
        })
    },[])



    return(
        <>
            {(typeof senderName === 'undefined')?(
                <div className="spinner-border text-danger" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            ):(
                <>
                    <div>
                        <div className="float-start mx-2">
                            <i className="fa-solid fa-user text-warning float-start fa-2x me-2"></i>
                        </div>
                        <h2 style={{color:"gold"}}>{senderName}</h2>
                    </div><hr/>
                    
                    <div className="row">
                        <div className="col-md-11"></div>
                    </div><br/>

                    <div className="row">
                        <div className="col-md-11"></div>
                    </div>
                </>
            )}
            
        </>
    )
}

export default Inboxmessage