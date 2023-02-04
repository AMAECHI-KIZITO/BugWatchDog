import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const Groupinboxmessage= ({userSession}) => {
    const {groupIdentity}=useParams();
    const navigate=useNavigate();
    const [loadData, setLoadData] = useState('Loading');
    const [groupData, setGroupData]=useState({});
    const [currentGroupId, setCurrentGroupId] = useState('');
    const [groupChatData, setGroupChatData]=useState([]);
    const [groupMembers, setGroupMembers]=useState('');
    const [nonGroupMembers, setNonGroupMembers] = useState([]);
    const [newMembers, setNewMembers] = useState([]);

    //sending a new message variables
    const[message,setNewMessage]=useState(null);
    const[msgStatus, setMsgStatus]=useState(0);

    // message content
    const messageContent=(event)=>{
        if(msgStatus==0){
            setNewMessage(event.target.value);
        }
        setMsgStatus(0);
        setNewMessage(event.target.value);
    };

    
    //Get friends that have not been added to the group
    useEffect( ()=>{
        fetch(`https://bugwatch.com.ng/api/v1/fetch-unadded-group-members/?dev=${userSession}&grpID=${groupIdentity}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            //console.log(data);
            setNonGroupMembers(data.members);
        })
    },[]);
    
    // get group data information
    useEffect( ()=>{
        fetch(`https://bugwatch.com.ng/api/v1/group-inbox-messages/?dev=${userSession}&grpID=${groupIdentity}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            let the_data = Object.values(data.group_info[0]);
            //console.log(the_data);
            //console.log(data);
            setLoadData('Loaded');
            setGroupData(the_data);
            setCurrentGroupId(the_data[3]);
            setGroupChatData(data.chat_history);
            document.title=the_data[4];
        })
    },[msgStatus]);

    // get group Membership information
    useEffect( ()=>{
        fetch(`https://bugwatch.com.ng/api/v1/get-group-membership?grpID=${groupIdentity}&dev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            //console.log(data);
            setGroupMembers(data.membership);
        })
    },[msgStatus]);
    

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
        

        fetch("https://bugwatch.com.ng/api/v1/send-group-message/",{
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"https://bugwatch.com.ng/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(messageData)
        })
        .then(response => response.json())
        .then(data => {
            setMsgStatus(1);
            document.getElementById("writeMessage").value="";
        });
    };

    //add new members to the group
    const addMembers=()=>{
        let groupid = groupIdentity
        let membersData = { newMembers, groupid, userSession }

        if(newMembers.length==0){
            alert('No members selected');
            return;
        }else{
            fetch("https://bugwatch.com.ng/api/v1/add-group-members/",{
                method:"POST",
                mode:'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"https://bugwatch.com.ng/",
                    "Access-Control-Allow-Credentials":true
                },
                body: JSON.stringify(membersData)
            })
            .then(resp=> {
                if(resp.status >=  200 && resp.status <=299 && newMembers.length==1){
                    fetch(`https://bugwatch.com.ng/api/v1/fetch-unadded-group-members/?dev=${userSession}&grpID=${groupIdentity}`)
                    .then(rsp=>rsp.json())
                    .then(data=>{
                        setNonGroupMembers(data.members);
                        setNewMembers([]);

                        return fetch(`https://bugwatch.com.ng/api/v1/get-group-membership?grpID=${groupIdentity}&dev=${userSession}`)
                        .then(rsp=>rsp.json())
                        .then(data=>{
                            setGroupMembers(data.membership);
                            
                            let selectedChoices=document.getElementsByClassName('selectPossibleMember');
                            for(let i = 0; i < selectedChoices.length; ++i){
                                if(selectedChoices[i].checked){
                                    selectedChoices[i].checked=false;
                                }
                            }

                            setNewMembers([]);

                            alert(`Member Successfully Added.`);
                        })
                    })
                }
                else{
                    fetch(`https://bugwatch.com.ng/api/v1/fetch-unadded-group-members/?dev=${userSession}&grpID=${groupIdentity}`)
                    .then(rsp=>rsp.json())
                    .then(data=>{
                        setNonGroupMembers(data.members);
                        setNewMembers([]);
                        
                        return fetch(`https://bugwatch.com.ng/api/v1/get-group-membership?grpID=${groupIdentity}&dev=${userSession}`)
                        .then(rsp=>rsp.json())
                        .then(data=>{
                            setGroupMembers(data.membership);
                            
                            let selectedChoices=document.getElementsByClassName('selectPossibleMember');
                            for(let i = 0; i < selectedChoices.length; ++i){
                                if(selectedChoices[i].checked){
                                    selectedChoices[i].checked=false;
                                }
                            }

                            setNewMembers([]);

                            alert(`Members Successfully Added.`);
                        })
                    })
                }
            })
        }
    };

    //Close Menu Offcanvas
    const closeLink =()=>{
        document.getElementById('btnCloseGroupLink').click();
    };

    //Exit group chat
    const exitGroupChat=()=>{
        if(userSession == groupData[2]){
            if(window.confirm('You are about to leave the group you created. Your admin rights will be passed onto someone else. Proceed?')){
                fetch(`https://bugwatch.com.ng/api/v1/admin-leave-group-chat/?grpID=${groupIdentity}&dev=${userSession}`)
                .then(rsp=>rsp.json())
                .then(data=>{
                    //console.log(data);
                    navigate(-1);
                })
            }
        }
        else if(window.confirm('Do you want to leave the group?')){
            fetch(`https://bugwatch.com.ng/api/v1/leave-group-chat?grpID=${groupIdentity}&dev=${userSession}`)
            .then(rsp=>rsp.json())
            .then(data=>{
                //console.log(data);
                navigate(-1);
            })
        }
    };

    //Remove a member (For group admins only)
    const removeMember=(memberId, memberName)=>{
        if(window.confirm(`Remove ${memberName} from group?`)){
            let removeData={
                groupIdentity,memberId
            }
            fetch(`https://bugwatch.com.ng/api/v1/remove-group-member/`,{
                method:"POST",
                mode:'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"https://bugwatch.com.ng/",
                    "Access-Control-Allow-Credentials":true
                },
                body: JSON.stringify(removeData)
            })
            .then(resp=> {
                if(resp.status=="200"){
                    return fetch(`https://bugwatch.com.ng/api/v1/get-group-membership?grpID=${groupIdentity}&dev=${userSession}`)
                    .then(rsp=>rsp.json())
                    .then(data=>{
                        setGroupMembers(data.membership);
                        return fetch(`https://bugwatch.com.ng/api/v1/fetch-unadded-group-members/?dev=${userSession}&grpID=${groupIdentity}`)
                        .then(rsp=>rsp.json())
                        .then(data=>{
                            //console.log(data);
                            setNonGroupMembers(data.members);
                            alert(`You have removed ${memberName} from the groupchat.`);
                        })
                    })
                }
            });
        }
    };

    return(
        <>
            <div>

                {
                    ( loadData ==='Loading' )
                    ?
                    (
                        <>
                            <div className="row">
                                <div className="col-12">
                                    <div>
                                        <i className="float-start me-2 ms-1 btn btn-warning fa-solid fa-arrow-left" onClick={()=>navigate(-1)}></i>
                                        <h3 style={{color:"gold"}}>
                                            Loading...
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                    :
                    (
                        <>
                            <div className="row">
                                <div className="col-11">
                                    <div>
                                        <i className="float-start me-2 ms-1 btn btn-warning fa-solid fa-arrow-left" onClick={()=>navigate(-1)}></i>
                                        <h3 style={{color:"gold"}}>
                                            {groupData[4]}
                                            <i className="btn btn-outline-warning mt-2 fa-solid fa-ellipsis-vertical float-end" type='button' data-bs-toggle="offcanvas" data-bs-target="#groupLinks" aria-controls="offcanvasEnd"></i>
                                        </h3>
                                    </div>
                                    <small style={{color:"#AAAAAA"}}>{groupData[0].slice(0,30)}...</small>
                                </div>
                            </div>
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
                                                                {/* Trying to add a delete functionality */}
                                                                {/* <i className='fa-solid fa-trash text-danger float-end'></i> */}
                                                            </p> 
                                                            <p className="float-end me-1" style={{fontSize:"8px"}} id="messageSentByMeTimeStamp">
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

            {/*This is the menu offcanvas*/}
            <div className="me-md-3 offcanvas offcanvas-end" tabIndex="-1" id="groupLinks" aria-labelledby="offcanvasEndLabel" style={{height:"300px", backgroundColor:"gold"}}>
                <div className="offcanvas-header">
                    <h5 id="offcanvasEndLabel">Group Info</h5>
                    <button type="button" id="btnCloseGroupLink" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        <div className="d-flex align-items-center justify-content-center">
                            <div style={{border:"1px solid gold"}}>
                                <p><a className='btn' style={{textDecoration:"None"}} data-bs-toggle="modal" data-bs-target="#groupInfoModal" onClick={closeLink}>Group info</a></p>
                                <p><a className='btn' style={{textDecoration:"None"}} onClick={exitGroupChat}>Exit group</a></p>
                                {
                                    userSession == groupData[2]
                                    ?
                                    <>
                                        <p>
                                            <a className='btn' style={{textDecoration:"None"}} type="button" data-bs-toggle="offcanvas" data-bs-target="#addMembersToGroupOffcanvas" aria-controls="offcanvasEnd">
                                                Add new member
                                            </a>
                                        </p>

                                        <p>
                                            <a className='btn' style={{textDecoration:"None"}} type="button" data-bs-toggle="offcanvas" data-bs-target="#removeMembersToGroupOffcanvas" aria-controls="offcanvasEnd">
                                                Remove a member
                                            </a>
                                        </p>
                                    </>
                                    :
                                    <p></p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Add new members off canvas */}
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="addMembersToGroupOffcanvas" aria-labelledby="addMembersToGroupOffcanvasLabel" style={{backgroundColor:"#05204a", color:"#ffffff"}}>
                <div className="offcanvas-header">
                    <h5 id="addMembersToGroupOffcanvasLabel">Add a Group Member</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
                </div><hr></hr>


                <div className="row offcanvas-body">
                    <div className="col-12">
                    {   
                        (nonGroupMembers.length==0 || typeof nonGroupMembers==='string')
                        ?
                        (
                            <div className="row align-items-center" style={{minHeight:'400px'}}>
                                <div className="col">
                                <h4 className="text-center" style={{color:"grey"}}>No Friends Missing in Group.</h4>
                                </div>
                            </div>
                        ):(
                            <>
                                {
                                    nonGroupMembers.map(member =>
                                        <div className="row" key={member.serial_no}>
                                            <div className="col-12 py-2">
                                                <p>{member.dev_nickname[0].toUpperCase() + member.dev_nickname.substring(1)} <input type='checkbox' className='selectPossibleMember form-check-input float-end' onClick={
                                                
                                                (
                                                    newMembers.includes(member.dev_id)
                                                )
                                                ?

                                                (
                                                    ()=>setNewMembers(newMembers => newMembers.filter(newMember=>newMember!== member.dev_id))
                                                )

                                                : 
                                                (
                                                    ()=>setNewMembers(newMembers => newMembers.concat(member.dev_id))
                                                )
                                            
                                                }/></p>
                                            </div>
                                        </div>
                                    )
                                }
                                <div>
                                    <button className="btn btn-outline-warning float-end" style={{borderRadius:"50%"}}  onClick={addMembers}>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </>
                        )
                    }
                    </div>
                </div>
            </div>

            {/* Remove Group members off canvas */}
            <div className="offcanvas offcanvas-end" tabIndex="-1" id="removeMembersToGroupOffcanvas" aria-labelledby="removeMembersToGroupOffcanvasLabel" style={{backgroundColor:"#05204a", color:"#ffffff"}}>
                <div className="offcanvas-header">
                    <h5 id="removeMembersToGroupOffcanvasLabel">Remove a Group Member</h5>
                    <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" style={{backgroundColor:"gold"}}></button>
                </div><hr></hr>


                <div className="row offcanvas-body">
                    <div className="col-12">
                    {   
                        (typeof groupMembers === 'string')
                        ?
                        (
                            <div className="row align-items-center" style={{minHeight:'400px'}}>
                                <div className="col">
                                    <h6 className="text-center" style={{color:"grey"}}>Loading...</h6>
                                </div>
                            </div>
                        ):(
                            <>
                                {
                                    groupMembers.map(member =>{
                                        if(member.dev_id==userSession){
                                            return <div className="row" key={member.dev_id}>
                                                <div className="col-12 py-2">
                                                    <p className="py-2">You</p>
                                                </div>
                                            </div>
                                        }
                                        else{
                                            return <div className="row" key={member.dev_id}>
                                                <div className="col-12 py-2">
                                                    <p className="py-2">
                                                        {member.dev_nickname[0].toUpperCase() + member.dev_nickname.substring(1)}
                                                        <button className="btn btn-warning btn-sm float-end" onClick={()=>removeMember(member.dev_id, member.dev_nickname)}>
                                                            <i className="fa-solid fa-trash text-danger">
                                                            </i>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        }
                                    })
                                }
                            </>
                        )
                    }
                    </div>
                </div>
            </div>





            {/* Group Info Modal */}
            <div className="modal fade" id="groupInfoModal" tabIndex="-1" aria-labelledby="groupInfoModalModalLabel" aria-hidden="true" data-bs-backdrop='static' data-bs-keyboard='false'>
                <div className="modal-dialog modal-fullscreen-md-down">
                    <div className="modal-content" style={{backgroundColor:'gold'}}>
                        
                        <div className="modal-body">
                            <div className="row">
                                <div className='col-12'>
                                    <button type="button" className="btn-close float-end" data-bs-dismiss="modal" aria-label="Close"></button><br/>
                                    <h5 className="modal-title text-center mb-2"><i className="fa-solid fa-user fa-3x"></i></h5>
                                    <h3 className="modal-title text-center" id="groupInfoModalModalLabel">{groupData[4]}</h3>
                                    <p className="text-center"><small style={{textAlign:"justify"}}>{groupData[0]}</small></p>
                                    <p className="text-center" style={{lineHeight:"0px"}}>Group. {groupData[5]} participants</p>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col">
                                    <h5>Participants</h5>
                                    {
                                        typeof groupMembers === 'string'
                                        ?
                                        <p>Loading...</p>
                                        :
                                        <>
                                            {
                                                groupMembers.map(member =>{
                                                    if (member.friend_status=="Friend"){
                                                        return<div key={member.dev_id}>
                                                            <p className="py-2">{member.dev_nickname[0].toUpperCase() + member.dev_nickname.substring(1)}</p>
                                                        </div>
                                                    }
                                                    else if(member.dev_id==userSession){
                                                        return <div key={member.dev_id}>
                                                            <p className="py-2">You</p>
                                                        </div>
                                                    }
                                                    else if(member.friend_status=="Friend Request Pending"){
                                                        return <div key={member.dev_id}>
                                                            <p className="py-2">{member.dev_nickname[0].toUpperCase() + member.dev_nickname.substring(1)} <a type='button' className="btn btn-dark btn-sm float-end" id={`btn${member.dev_id}`} onClick={()=>{

                                                                fetch(`https://bugwatch.com.ng/api/v1/accept-friend-request/?invitee=${userSession}&invited=${member.dev_id}`)
                                                                .then( rsp => rsp.json())
                                                                .then( data => {
                                                                    alert(data.message);

                                                                    return fetch(`https://bugwatch.com.ng/api/v1/get-group-membership?grpID=${groupIdentity}&dev=${userSession}`)
                                                                    .then(rsp=>rsp.json())
                                                                    .then(data=>{
                                                                        setGroupMembers(data.membership);
                                                                    })
                                                                })
                                                            }}>Accept Request</a></p>
                                                        </div>
                                                    }
                                                    else if(member.friend_status=="Friend Request Sent"){
                                                        return <div key={member.dev_id}>
                                                        <p className="py-2">{member.dev_nickname[0].toUpperCase() + member.dev_nickname.substring(1)} <button type='button' className="btn btn-dark btn-sm float-end" id={`btn${member.dev_id}`} disabled>Friend Request Sent</button></p>
                                                        </div>
                                                    }
                                                    return <div key={member.dev_id}>
                                                        <p className="py-2">{member.dev_nickname[0].toUpperCase() + member.dev_nickname.substring(1)} <a type='button' className="btn btn-dark btn-sm float-end" id={`btn${member.dev_id}`} onClick={()=>{
                                                            fetch(`https://bugwatch.com.ng/api/v1/send-friend-request/?userSession=${userSession}&friendRequestRecipient=${member.dev_id}`)
                                                            .then( rsp => rsp.json())
                                                            .then( data => {
                                                                document.getElementById(`btn${member.dev_id}`).style.display="none";
                                                            })
                                                        }}>Add friend</a></p>
                                                    </div>
                                                })
                                            }
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Groupinboxmessage