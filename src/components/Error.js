import React from "react"
import { useNavigate } from "react-router-dom"
import oops from "../images/oops.png"

function Error(){
    const navigate = useNavigate()
    document.title='Debugger - Error 404';
    return(
        <>
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand">DEBUGGER <i className="fa-solid fa-bugs"></i></a>
                            <button className='btn btn-success btn-lg float-end d-md-none' type="button" data-bs-toggle="offcanvas" data-bs-target="#debuggerAppLinks" aria-controls="debuggerAppLinks" style={{backgroundColor:"gold"}}>
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>
            
            <div className="row error404">
                <div className="col-12"></div>
                <h1 className="text-center" style={{fontSize:"80px"}}>OOPS!</h1>
                <p className="text-center"><img src={oops} width='200px'  style={{borderRadius:"50%"}}/></p>
                <h1 className="text-center">Error 404</h1>
                <p className="text-center">Page not found</p><br/>
                <p className="text-center">
                    <button className="btn btn-warning btn-md-sm" onClick={()=>navigate(-1)}>
                        Previous page
                    </button>
                    </p>
            </div>
        </>
    )
}

export default Error