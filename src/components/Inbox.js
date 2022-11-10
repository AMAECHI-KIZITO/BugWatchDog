import React, {useEffect, useState} from "react"


const Inbox=({userSession})=>{
    const [myInbox, setMyInbox]=useState([])
    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/inbox/?devId=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            console.log(data)
        })
    },[])

    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3" style={{color:"gold"}}>Inbox</h2><hr/>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inbox