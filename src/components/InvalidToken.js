import React from "react";
import { useParams } from "react-router-dom";


function InvalidToken(){
    document.title = 'Account Validation Failed';
    const {gmail} = useParams();


    const resendVerificationEmail = () => {
        let resendEmail={
            gmail
        };

        fetch("http://localhost:5000/api/v1/resend-verification-link/",{
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"http://localhost:5000/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(resendEmail)
        })
        .then(resp=> {
            if(resp.status >=  200 && resp.status <=299){
                alert("VERIFICATION LINK SENT");
            }
        })
            
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
                            <i className="fa-solid fa-circle-exclamation fa-9x text-danger"></i>
                        </p>
                        <p className="text-center text-light">This Email Verification Link is Invalid.</p>
                        <p className="text-center text-light">To re-initiate the verification process click <a className="btn btn-warning btn-sm" onClick={resendVerificationEmail}>Here</a></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InvalidToken