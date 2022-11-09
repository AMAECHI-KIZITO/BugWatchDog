import React, {useEffect, useState} from "react"


const Seekhelp=({userSession})=>{
    const [availableDevelopers, setAvailableDevelopers]=useState([])
    const [serialNumber, setSerialNumber]=useState(0)

    const increase=()=>{
        setSerialNumber(++serialNumber);
        return serialNumber
    }

    useEffect( ()=>{
        fetch(`http://localhost:5000/api/v1/developers/?currentDev=${userSession}`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setAvailableDevelopers(data.developers)
        })
    },[])

    return(
        <>
            <div className="row dashboardlinks">
                <div className="col-md-11">
                    <div className="row">
                        <div className="col-12">
                            <h2 className="mb-3" style={{color:"gold"}}>Ask For Help</h2><hr/>
                            
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
                                                    <td key={dev.dev_stack}>{dev.dev_stack}</td>
                                                    <td key={`message${dev.dev_id}`}><button className="btn btn-warning btn-sm">Message</button></td>
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

export default Seekhelp