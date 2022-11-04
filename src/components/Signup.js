import React, {useEffect, useState} from "react"
import {Link} from "react-router-dom"

const Signup = ()=>{
    
    const [fname, setFname] = useState(null)
    const [lname, setLname] = useState(null)
    const [nickname, setNickname] = useState(null)
    const [regemail, setRegemail] = useState("")
    const [pswd, setPswd] = useState(null)
    const[signupresp, setSignupresp]=useState(null)
    const[emailcheck,setEmailcheck]=useState(null)



    const setfirstname=(event)=>setFname(event.target.value)
    const setlastname=(event)=>setLname(event.target.value)
    const setnickname=(event)=>setNickname(event.target.value)
    const setpswd=(event)=>setPswd(event.target.value)
    const setemail = (event) => {setRegemail(event.target.value);}
    

    const checkEmailAvailability = ()=>{
        if(regemail != ""){
            fetch(`http://localhost:6200/api/v1/check_email_availability/?email=${regemail}`)
            .then(resp=> resp.json())
            .then(data=>{
                let feedback=data;
                let Reply=Object.values(feedback);
                    
                setEmailcheck(Reply);
            })
        }
        return;
    }


    const registerUser= (event)=>{
        event.preventDefault();
        checkEmailAvailability();
        
        if(!fname || !lname || !nickname || !pswd || regemail==""){ 
            alert("Fill out all fields");
            return;
        }
        else if (emailcheck != "Email Is Available") return;
        
        let regData={
            fname,
            lname,
            nickname,
            regemail,
            pswd
        }
        fetch("http://localhost:6200/api/v1/registeruser/", {
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"http://localhost:5000/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(regData)
        })
        .then( resp =>{
            if(resp.status==200){
                setSignupresp("Registration Successful")
                window.location.href="/"
            }
        })
    }






    return(
        <>
            <div className="row signUp">
                <div className="col-md-6 offset-md-3">
                    <h1 className="text-center" id="signUpHeader">Sign up To DEBUGGER</h1>
                    <h6>Note: Click proceed when the email notification changes to <span id="emailFeedback">Email is available</span></h6>
                    <p>{signupresp}</p>

                    <form onSubmit={registerUser}>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                            <input type='text' className="form-control py-3" name="firstname" id="firstname" placeholder="Firstname" onChange={setfirstname}/>
                        </div>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-regular fa-user"></i></span>
                            <input type='text' className="form-control py-3" name="lastname" id="lastname" placeholder="Lastname" onChange={setlastname}/>
                        </div>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-id-card"></i></span>
                            <input type='text' className="form-control py-3" name="nickname" id="nickname" placeholder="Enter your preferred nickname" onChange={setnickname}/>
                        </div>


                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                            <input type='email' className="form-control py-3" name="emailAddressRegistration" id="emailAddressRegistration" placeholder="Email address" onChange={setemail}/>
                        </div>
                        <p style={{fontSize:'12px'}}>{emailcheck}</p>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                            <input type='password' className="form-control py-3" name="password" id="password" placeholder="Enter password" onChange={setpswd}/>
                        </div>

                        <div>
                            <button className="btn btn-success float-end">Proceed</button>
                        </div>
                    </form>
                </div><br/>

                <div className="col-md-6 offset-md-3">
                    <h6 className="text-center">Already have an account? <Link to="/" >Login</Link></h6>
                </div>
            </div>
        </>
    )
}


export default Signup