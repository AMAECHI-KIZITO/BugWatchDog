import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";



function Home({setUser, setUserSession}){
    document.title='BugWatch - Login';
    const navigate = useNavigate();

    const [emailInput,setEmailInput]=useState(null);
    const [passwordInput, setPasswordInput]=useState(null);
    const emailEntry = (event) => setEmailInput(event.target.value);
    const passwordEntry = (event) => setPasswordInput(event.target.value);

    const [loginFeedback, setLoginFeedback] = useState(null);
    

    //login user
    const loginUser=(event) => {
        event.preventDefault();
        if(!emailInput || !passwordInput){ 
            alert("Fill out all fields");
            return;
        }

        const loginData={
            emailInput, passwordInput
        }

        
        fetch("https://bugwatch.com.ng/api/v1/login-user/", {
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"https://bugwatch.com.ng/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(loginData)
        })
        .then(response => response.json())
        .then(data => {
            let logindata=data
            if(logindata.status==true){
                setUser(logindata.dev_username);
                setUserSession(logindata.sessionId);
                navigate("/dashboard");
            }else{
                setLoginFeedback(logindata.message);
                return;
            }
            
        });
    }

    return(
        <>
            <div className="row homeWelcome">
                <div className="col-md-6 offset-md-3">
                    <h1 className="text-center" id="welcomeMessage">Welcome To BUGWATCH</h1>
                    {
                        loginFeedback == null
                        ?
                        <h5></h5>
                        :
                        <h5 className="text-center text-danger alert alert-danger">{loginFeedback}</h5>
                    }
                    <form onSubmit={loginUser}>
                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                            <input type='email' className="form-control py-3" name="emailAddress" id="emailAddress" placeholder="Email address" onChange={emailEntry}/>
                        </div>
                        <div className="input-group">
                            <span className="input-group-text"><i className="fa-solid fa-key"></i></span>
                            <input type='password' className="form-control py-3" name="password" id="password" placeholder="Password" onChange={passwordEntry}/>
                        </div><br/>
                        <div>
                            <button className="btn btn-success form-control">Login</button>
                        </div><br/>
                    </form><br/>
                    <h6 className="text-center">Don't have an account? <Link to="/signup" className="btn btn-sm btn-md-lg btn-outline-warning">Sign Up</Link></h6>
                </div>
            </div>
        </>
    )
}

export default Home