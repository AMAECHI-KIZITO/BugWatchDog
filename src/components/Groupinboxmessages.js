import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


const Groupinboxmessage= ({userSession}) => {
    const {groupIdentity}=useParams();
    const navigate=useNavigate();
    const [loadData, setLoadData] = useState('Loading');
    const [groupData, setGroupData]=useState({});
    const [currentGroupId, setCurrentGroupId] = useState('');
    const [groupChatData, setGroupChatData]=useState([]);

    //sending a new message variables
    const[message,setNewMessage]=useState(null)
    const[msgStatus, setMsgStatus]=useState(0)

    // message content
    const messageContent=(event)=>{
        if(msgStatus==0){
            setNewMessage(event.target.value);
        }
        setMsgStatus(0);
        setNewMessage(event.target.value);
    }


    // get group data information
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/group-inbox-messages/?dev=${userSession}&grpID=${groupIdentity}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let the_data = Object.values(data.group_info[0]);
            console.log(the_data);
            console.log(data);
            setLoadData('Loaded');
            setGroupData(the_data);
            setCurrentGroupId(the_data[2]);
            setGroupChatData(data.chat_history);
        })
    },[msgStatus])
    

    //send a new group message
    const handleSubmit=(event)=>{
        event.preventDefault();
        
        if(!message || message.trim().length==0){
            alert("Nothing to send.")
            return;
        }

        let messageData={
            message,userSession,currentGroupId
        }
        

        fetch("http://localhost:5000/api/v1/send-group-message/",{
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
                setMsgStatus(1);
                document.getElementById("writeMessage").value="";
            }
        })
    }


    return(
        <>
            <div>

                {
                    ( loadData ==='Loading' )
                    ?
                    (
                        <>
                            <div className="float-start me-1 ms-1">
                                <i className="fa-solid fa-arrow-left text-warning" onClick={()=>navigate(-1)}></i>
                            </div>
                            <h3 style={{color:"gold"}}>
                                Loading...
                            </h3>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="float-start me-2 ms-1">
                                <i className="fa-solid fa-arrow-left text-warning" onClick={()=>navigate(-1)}></i>
                            </div>
                            <h3 style={{color:"gold"}}>
                                {groupData[3]}
                            </h3>
                        </>
                    )
                }
            </div><hr/>

            <div className="row">
                <div className="col-md-11">
                {
                    ( loadData ==='Loading' )
                    ?
                    (
                        <div className="row align-items-center" style={{minHeight:'400px'}}>
                            <div className="text-center">
                                <div className="spinner-border text-warning" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )
                    :
                    (
                        <>
                            {
                                typeof groupChatData === 'string'
                                ?
                                
                                <>
                                    {/* When there's no message */}
                                    <div className='row' style={{height:"400px"}} id="messageSection">
                                        <div className='col-12'>
                                            <h6 className="text-center" style={{color:'#AAAAAA'}}>No messages yet in this group</h6>
                                            <p className="text-center" style={{color:'#AAAAAA'}}>Start a Conversation</p>
                                        </div>
                                    </div>


                                    <div className="row mx-1" style={{position:"sticky", bottom:"0px",backgroundColor:'#05204a'}}>
                                        <div className="col-md-12">
                                            <form>
                                                <div className="input-group mb-2">
                                                    <input className="form-control" style={{backgroundColor:"inherit", color:"white", borderRadius:"30px"}} placeholder="Message Here"  id="writeMessage" onChange={messageContent}/>

                                                    <button className="input-group-text btn btn-warning" style={{borderRadius:"50%"}} onClick={handleSubmit}>
                                                        <i className="fa-regular fa-paper-plane"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </>
                                :
                                
                                <>
                                    {/* When messages exist */}
                                    <div className='row' style={{height:"400px"}} id="messageSection">
                                        <div className='col-12'>
                                            {
                                                groupChatData.map(chatRecord=>{
                                                    if(chatRecord.senderId == userSession){
                                                        return <div className='mb-4' key={chatRecord.msgId}>
                                                            <p  className="col-10 offset-2 py-2 px-3" id="messageSentByMe">
                                                                {chatRecord.message}
                                                            </p> 
                                                            <p className="float-end" style={{fontSize:"8px"}} id="messageSentByMeTimeStamp">
                                                                {chatRecord.timestamp}
                                                            </p>
                                                        </div>
                                                    }
                                                    return <div className='mb-2' key={chatRecord.msgId}>
                                                        <span className="ms-1" style={{fontSize:'12px',color:'gold'}}>{chatRecord.senderName[0].toUpperCase() + chatRecord.senderName.substring(1)}</span>
                                                        <p className="col-10 py-2 px-3 ms-1" style={{color:"white"}} id="messageSentByThem" key={chatRecord.msgId}>
                                                            {chatRecord.message}
                                                        </p>
                                                        <p style={{fontSize:"8px"}} id="messageSentByThemTimeStamp" className='ms-1'>
                                                            {chatRecord.timestamp}
                                                        </p>
                                                    </div>
                                                })
                                            }
                                        </div>
                                    </div>


                                    <div className="row mx-1" style={{position:"sticky", bottom:"0px",backgroundColor:'#05204a'}}>
                                        <div className="col-md-12">
                                            <form>
                                                <div className="input-group mb-2">
                                                    <input className="form-control" style={{backgroundColor:"inherit", color:"white", borderRadius:"30px"}} placeholder="Message Here"  id="writeMessage" onChange={messageContent}/>
                                                    <button className="input-group-text btn btn-warning" style={{borderRadius:"50%"}} onClick={handleSubmit}>
                                                        <i className="fa-regular fa-paper-plane"></i>
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </>
                            }
                        </>
                    )
                }
                </div>
            </div>
        </>
    )
}

export default Groupinboxmessage