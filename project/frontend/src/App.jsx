import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import * as Pages from './pages/index';
import './App.css';

function App() {

  const [currentUser, setCurrentUser] = useState({
    email: "admin@test.com",
    profilePicUrl: ""
  });

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Pages.Portal />} />
            <Route path="portal" element={<Pages.Portal />} />
            <Route path="signup" element={<Pages.SignUp />} />
            <Route path="login" element={<Pages.Login setCurrentUser={setCurrentUser} />} />
            <Route path="home" element={<Pages.Homepage currentUser={currentUser}/>} />
            <Route path="forgotpassword" element={<Pages.ForgotPassword />} />
        </Routes>
    </Router>
  );

}

export default App

