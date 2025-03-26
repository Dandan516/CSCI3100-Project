import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import * as Pages from './pages/index';
import './App.css';

function App() {

  const [currentUser, setCurrentUser] = useState({
    email: "user1@test.com",
    profilePicUrl: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
  });

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Pages.Portal />} />
            <Route path="portal" element={<Pages.Portal />} />
            <Route path="login" element={<Pages.Login setCurrentUser={setCurrentUser} />} />
            <Route path="signup" element={<Pages.SignUp />} />
            <Route path="home" element={<Pages.Homepage currentUser={currentUser}/>} />
        </Routes>
    </Router>
  );

}

export default App

