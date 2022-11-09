import React, {useState, useEffect, useContext, createContext} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Error from "./components/Error";
import Signup from "./components/Signup";
import SharedDashboardLinks from "./components/SharedDashboardLinks";
import Newproject from "./components/NewProject";
import Addbug from "./components/Addbug";
import ProtectDashboard from "./components/Protectdashboard";
import Viewprojects from "./components/Viewprojects";
import Sharedprojectslayout from "./components/Sharedprojectslayout";
import SingleProject from "./components/Singleproject";
import Seekhelp from "./components/Seekhelp";


function App(){
  const [user, setUser]=useState(null)
  const [userSession, setUserSession]=useState(null)

  return(
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={ <Home setUser={setUser} setUserSession={setUserSession}/> } />

          <Route path="signup" element={ <Signup/> } />

          <Route path="navigation" element={ <Navigation/> } />

          <Route path="sharedlayout" element={ <SharedDashboardLinks/> } />

          <Route path="*" element={ <Error/> } />

          
          <Route path='/dashboard' element={ 
            <ProtectDashboard user={user}>
              <SharedDashboardLinks user={user} userSession={userSession} setUser={setUser} setUserSession={setUserSession}/> 
            </ProtectDashboard>
            }>

            <Route index element={<Dashboard userSession={userSession}/>} />
            <Route path="newproject" element={ <Newproject userSession={userSession}/> } />
            <Route path="addbug" element={ <Addbug userSession={userSession}/> } />
            <Route path="seekhelp" element={<Seekhelp userSession={userSession}/>}/>

            <Route path="myprojects" element={<Sharedprojectslayout userSession={userSession}/>}>
              <Route index element={ <Viewprojects userSession={userSession}/> } />
              <Route path=":projectId" element={ <SingleProject userSession={userSession}/> } />
            </Route>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App