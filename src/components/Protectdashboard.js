import React from "react"
import { Navigate } from "react-router-dom"


const ProtectDashboard= ({children, user})=>{
    if(!user){
        return <Navigate to="/"/>
    }
    return children;
}

export default ProtectDashboard