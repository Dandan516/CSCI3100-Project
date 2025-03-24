import React from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Portal from './pages/Portal';
import './App.css';

function App() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Portal />} />
            <Route path="portal" element={<Portal />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="home" element={<Dashboard />} />
        </Routes>
    </Router>
  );

}

export default App

