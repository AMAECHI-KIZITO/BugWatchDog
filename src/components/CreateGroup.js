import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";


function Creategroup({userSession}){

    const navigate=useNavigate()
    const[myFriends, setMyFriends]=useState([])
    const [groupName, setGroupName]=useState(null);
    const [groupBio, setGroupBio]=useState(null);
    const [userId, setUserId]=useState(userSession);

    //get my friends
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/get-friends/?currentDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setMyFriends(data.developers);
        })
    },[])

    //creating a unique group identifier
    const grpRandomId=(length,characters)=>{
        let uniqueId = ""
        for(let i=length; i>0; --i){
            uniqueId = uniqueId + characters[ Math.floor(Math.random() * characters.length ) ];
        }
        return uniqueId;
    }


    const createGroup=(e)=>{

        e.preventDefault();
        let rString = grpRandomId(10, "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM");

        if(!groupName || !groupBio || !userId){
        alert("Fill out form fields")
        return;
        }else if(groupBio.trim().length==0 || groupName.trim().length==0){
        alert("Fill out the form")
        return;
        }else if(groupBio.trim().length>200){
        alert("Description exceeds max length of 200")
        return;
        }  

        fetch(`http://localhost:5000/api/v1/create-group/?groupName=${groupName}&groupBio=${groupBio}&groupFounder=${userId}&uniqueId=${rString}`)
        .then(rsp=>rsp.json())
        .then(data=> {
            navigate(`/dashboard/creategroup/${data.group_id}/add-members`)
        })
    }



  return(
    <>
        <div className="row dashboardlinks">
            <div className="col-md-11">
                <div className="row">
                    <div className="col-12">
                        <h2 className="mb-3 ms-1" style={{color:"gold"}}>Create Group</h2><hr/>
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
                            <form onSubmit={createGroup}>
                                <div className="mb-3 mt-3">
                                    <label htmlFor="groupName" style={{color:"gold"}} className="ms-1 form-label">Group Name</label>
                                    <input type='text' className="form-control py-3" name="groupName" id="groupName" placeholder="Enter project name" onChange={(event)=>setGroupName(event.target.value)}/>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="projectdescription" style={{color:"gold"}} className="ms-1 form-label">Group Bio</label>
                                    <textarea className='form-control' name='projectdescription' onChange={(event)=>setGroupBio(event.target.value)}></textarea>
                                </div>

                                <div>
                                    <button className="btn ms-1" id="btnCreateNewGroup" style={{backgroundColor:"gold"}}>
                                        Create &nbsp;
                                        <i className="fa-solid fa-plane-departure text-danger"></i>
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}


export default Creategroup