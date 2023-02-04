import React from "react";


function ValidatedAccount(){
    document.title = 'Account Validated';

    const directUserToLogin = () => {
        window.location.href="http://localhost:3000/"
    }

    return(
        <>
            <div className="row">
                <div className="col-12">
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <div className="container-fluid">
                            <a className="navbar-brand">BUGWATCH <i className="fa-solid fa-bugs"></i></a>
                            <button className='btn btn-success btn-lg float-end d-md-none' type="button" data-bs-toggle="offcanvas" data-bs-target="#debuggerAppLinks" aria-controls="debuggerAppLinks" style={{backgroundColor:"gold"}}>
                                <i className="fa-solid fa-bars"></i>
                            </button>
                        </div>
                    </nav>
                </div>
            </div>


            <div className="row">
                <div style={{display:"flex", alignItems:"center", justifyContent:"center", minHeight:'450px'}}>
                    <div>
                        <p className="text-center">
                        <i className="fa-solid fa-circle-check fa-9x text-success"></i>
                        </p>
                        <p className="text-center text-light">Account Verified</p>
                        <p className="text-center text-light">To log into your account click <a className="btn btn-warning btn-sm" onClick={directUserToLogin}>here</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ValidatedAccount