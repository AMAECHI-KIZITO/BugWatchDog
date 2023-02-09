import React, {useEffect, useState} from "react"
import {Link, useNavigate} from "react-router-dom"

const Signup = ()=>{
    const navigate=useNavigate();

    const [fname, setFname] = useState(null);
    const [lname, setLname] = useState(null);
    const [nickname, setNickname] = useState(null);
    const [regemail, setRegemail] = useState("");
    const [pswd, setPswd] = useState(null);
    const[signupresp, setSignupresp]=useState(null);
    const [developerStack, setDeveloperStack]=useState('#');
    const [techstack, setTechstack]=useState([]);
    document.title='BugWatch - Sign Up';
    


    const setfirstname=(event)=>setFname(event.target.value);
    const setlastname=(event)=>setLname(event.target.value);
    const setnickname=(event)=>setNickname(event.target.value);
    const setpswd=(event)=>setPswd(event.target.value);
    const setemail = (event) => {setRegemail(event.target.value)};
    const chooseTechnology=(event)=>setDeveloperStack(event.target.value);
    useEffect( ()=>{
        fetch(`https://bugwatch.com.ng/api/v1/tech-stacks`)
        .then(rsp=>rsp.json())
        .then(data=>{
            setTechstack(data.stacks);
        })
    },[]);
    
    


    const registerUser= (event)=>{
        event.preventDefault();
        
        
        if(!fname || !lname || !nickname || !pswd || regemail==""){ 
            alert("Fill out all fields");
            return;
        }
        else if(developerStack=="#"){
            alert("Invalid choice of stack");
            return;
        }
        let regData={
            fname,
            lname,
            nickname,
            regemail,
            pswd,
            developerStack
        }
        fetch("https://bugwatch.com.ng/api/v1/registeruser/", {
            method:"POST",
            mode:'cors',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin":"https://bugwatch.com.ng/",
                "Access-Control-Allow-Credentials":true
            },
            body: JSON.stringify(regData)
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (data.message == "Registration Successful"){
                setSignupresp("Registration Successful. An activation link has been sent to your email");
                document.getElementById("resetForm").click();
            }
            else{
                setSignupresp(data.message);
            }
        });
    };






    return(
        <>
            <div className="row signUp">
                <div className="col-md-6 offset-md-3">
                    <h1 className="text-center mb-5 mt-3" id="signUpHeader">Sign up To BUGWATCH</h1>

                    {
                        signupresp == null
                        ?
                        <h5></h5>
                        :
                        (signupresp == 'Registration Successful. An activation link has been sent to your email'?<h5 className="text-center text-success alert alert-success">{signupresp}</h5>
                        :
                        (signupresp == 'This email has already been registered. Try again' || signupresp == 'Registration Failed. Incomplete Form Data' 
                        ?
                        <h5 className="text-center text-danger alert alert-danger">{signupresp}</h5>
                        :
                        <h5></h5>
                        ))
                    }

                    <form onSubmit={registerUser}>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                            <input type='text' className="form-control py-2" name="firstname" id="firstname" placeholder="Firstname" onChange={setfirstname}/>
                        </div>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-regular fa-user"></i></span>
                            <input type='text' className="form-control py-2" name="lastname" id="lastname" placeholder="Lastname" onChange={setlastname}/>
                        </div>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-laptop-code"></i></span>
                            <select className="form-select py-2" name="technologyStack" onChange={chooseTechnology}>
                                <option value="#">Choose your stack</option>
                                {Object.values(techstack).map(technology=>
                                    <option value={technology.id} key={technology.id}>{technology.name}</option>
                                )}
                            </select>
                        </div>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-id-card"></i></span>
                            <input type='text' className="form-control py-2" name="nickname" id="nickname" placeholder="Enter your preferred nickname" onChange={setnickname}/>
                        </div>

                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                            <input type='email' className="form-control py-2" name="emailAddressRegistration" id="emailAddressRegistration" placeholder="Email address" onChange={setemail}/>
                        </div>
                        
                        <div className="input-group mb-2">
                            <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                            <input type='password' className="form-control py-2" name="password" id="password" placeholder="Enter password" onChange={setpswd}/>
                        </div>

                        <div>
                            <button className="btn btn-success float-end">Proceed</button>
                        </div>
                        <div>
                            <button className="btn btn-success d-none" type='reset' id='resetForm'>Reset</button>
                        </div> 
                    </form>
                </div><br/>

                <div className="mt-3 col-md-6 offset-md-3">
                    <h6 className="text-center">Already have an account? <Link to="/" className="btn btn-outline-warning btn-sm">Login</Link></h6>
                </div>
            </div>
        </>
    )
}


export default Signup