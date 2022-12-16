import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"


function Newgroup({userSession}){
    const navigate = useNavigate()
    const {groupid} = useParams()
    const[myFriends, setMyFriends]=useState([])
    const[groupMembers, setGroupMembers]=useState([])
    const[groupMembersNames, setGroupMembersNames]=useState([])
    const[groupDetails, setGroupDetails]=useState([])
    document.title='Debugger - Create Group';

    
    //get my friends
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-friends/?currentDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setMyFriends(data.developers);
        })
    },[])

    //get group information
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-group-info/?groupId=${groupid}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setGroupDetails(data.details[0]);
        })
    },[])

    let membersData = { groupMembers, groupid, userSession }

    //add members to the group
    const addMembers=()=>{
        if(groupMembers.length==0){
            alert('No members selected');
            return;
        }else{
            fetch("http://localhost:5000/api/v1/add-group-members/",{
                method:"POST",
                mode:'cors',
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin":"http://localhost:5000/",
                    "Access-Control-Allow-Credentials":true
                },
                body: JSON.stringify(membersData)
            })
            .then(resp=> {
                if(resp.status=="200"){
                    alert(`Members Successfully Added to ${groupDetails.name} Group.`);
                    navigate("/dashboard/groupinbox")
                }
            })
        }
    }

    return(
    <>
        <div className="row dashboardlinks">
            <div className="col-md-11">
                <div className="row">
                    <div className="col-12">
                        <h2 className="ms-1" style={{color:"gold"}}>
                            {groupDetails.name} Group
                        </h2>
                        <p className='mb-3 ms-1 text-light'>Add participants</p><hr/>
                    </div>

                    

                    <div className="col-12">
                        {(typeof myFriends==="string")?(
                            <div className="row align-items-center" style={{minHeight:'400px'}}>
                                <div className="col">
                                    <h4 className="text-center" style={{color:"grey"}}>Ouch <i className='fa-solid fa-heart-crack text-danger'></i></h4>
                                    <p className="text-center" style={{color:"grey"}}>You haven't made any friends yet. To create a group, you'd need friends.</p>
                                </div>
                            </div>
                        ):(
                            <>
                                {
                                    myFriends.map(friend=>
                                        <>
                                            <div className='row mb-4' key={friend.serial_no}>

                                                <div className="col-12">
                                                    <div className="float-start mx-2">
                                                        <i className="fa-solid fa-user text-warning float-start fa-3x me-2"></i>
                                                    </div>
                                                    <span className="text-light float-end">
                                                        <input type='checkbox' className='form-check-input' onClick={
                                                
                                                        (
                                                            groupMembers.includes(friend.dev_id)
                                                        )
                                                        ?

                                                        (
                                                            ()=>setGroupMembers(groupMembers => groupMembers.filter(member=>member!== friend.dev_id))
                                                        )

                                                        : 
                                                        (
                                                            ()=>setGroupMembers(groupMembers => groupMembers.concat(friend.dev_id))
                                                        )
                                                    
                                                    }/>
                                                    </span>
                                                    <div>
                                                        <span className="text-light">{friend.dev_nickname[0].toUpperCase()  + friend.dev_nickname.substring(1)}</span>
                                                        <p className="text-light" style={{fontSize:'10px'}}>
                                                            {friend.dev_stack}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                <div>
                                    <button className="btn btn-outline-warning float-end" style={{borderRadius:"50%"}}  onClick={addMembers}>
                                        <i className="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}


export default Newgroup