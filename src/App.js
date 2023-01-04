import React, {useState, useEffect, useContext, createContext} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
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
import Inbox from "./components/Inbox";
import Sharedinboxlayout from "./components/Sharedinboxlayout";
import Inboxmessage from "./components/Inboxmessages";
import ViewSingleProjectBugs from "./components/Viewprojectbugs";
import Creategroup from "./components/CreateGroup";
import Newgroup from "./components/NewGroup";
import GroupInbox from "./components/GroupInbox";
import Sharedgroupinboxlayout from "./components/Sharedgroupinboxlayout";
import Groupinboxmessage from "./components/Groupinboxmessages";
import ExpiredToken from "./components/TokenExpired";
import InvalidToken from "./components/InvalidToken";
import ValidatedAccount from "./components/ValidatedAccount";

function App(){
  const [user, setUser]=useState(null)
  const [userSession, setUserSession]=useState(null)

  return(
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path="/" element={ <Home setUser={setUser} setUserSession={setUserSession}/> } />

          <Route path="signup" element={ <Signup/> } />

          <Route path="sharedlayout" element={ <SharedDashboardLinks/> } />

          <Route path="*" element={ <Error/> } />

          <Route path="/token-expired/:gmail" element={ <ExpiredToken/> } />

          <Route path="/invalid-token/:gmail" element={ <InvalidToken/> } />

          <Route path="/account-verified" element={ <ValidatedAccount/> } />

          
          <Route path='dashboard' element={ 
            <ProtectDashboard user={user}>
              <SharedDashboardLinks user={user} userSession={userSession} setUser={setUser} setUserSession={setUserSession}/> 
            </ProtectDashboard>
          }>

            <Route index element={<Dashboard userSession={userSession}/>} />
            <Route path="newproject" element={ <Newproject userSession={userSession}/> } />
            <Route path="addbug" element={ <Addbug userSession={userSession}/> } />
            <Route path="seekhelp" element={<Seekhelp userSession={userSession}/>}/>
            

            <Route path="creategroup" element={< Creategroup userSession={userSession} />}/>
            <Route path="creategroup/:groupid/add-members" element={< Newgroup userSession={userSession} />}/>

            <Route path="myprojects" element={<Sharedprojectslayout userSession={userSession}/>}>
              <Route index element={ <Viewprojects userSession={userSession}/> } />
              <Route path=":projectId" element={ <SingleProject userSession={userSession}/> } />
              <Route path=":projectId/viewbugs" element={ <ViewSingleProjectBugs userSession={userSession}/> } />
            </Route>

            <Route path="inbox" element={<Sharedinboxlayout userSession={userSession}/>}>
              <Route index element={ <Inbox userSession={userSession}/> } />
              <Route path=":msg" element={ <Inboxmessage userSession={userSession}/> } />
            </Route>
            
            <Route path="groupinbox" element={< Sharedgroupinboxlayout userSession={userSession} />}>
              <Route index element={< GroupInbox userSession={userSession} />}/>
              <Route path=":groupIdentity" element={< Groupinboxmessage userSession={userSession}/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App