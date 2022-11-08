import React, {useState, useEffect} from "react"
import {Link, Outlet} from "react-router-dom"


function Sharedprojectslayout({user,userSession, setUser, setUserSession}){
    

    return(
        <Outlet/>
    )
}


export default Sharedprojectslayout