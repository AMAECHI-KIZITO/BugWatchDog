import React, {useState, useEffect, useContext, createContext} from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Home from "./components/Home";
import Navigation from "./components/Navigation";
import Error from "./components/Error";
import Signup from "./components/Signup";
import SharedDashboardLinks from "./components/SharedDashboardLinks";
import Newproject from "./components/NewProject";

export const Usercontext = createContext()


const currentUser={
  username:"The El_Olam",
}





function App(){
  return(
    <div className="App">
      <Usercontext.Provider value={currentUser}>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={ <Home/> } />

            <Route path="signup" element={ <Signup/> } />

            <Route path="navigation" element={ <Navigation/> } />

            <Route path="sharedlayout" element={ <SharedDashboardLinks/> } />

            <Route path="*" element={ <Error/> } />


            <Route path='/dashboard' element={ <SharedDashboardLinks/> }>
              <Route index element={<Dashboard/>} />
              <Route path="newproject" element={ <Newproject/> } />
            </Route>
          </Routes>
        </BrowserRouter>
      </Usercontext.Provider>
    </div>
  )
}


export default App