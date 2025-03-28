import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import * as Pages from './pages/index';
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./router/PrivateRoute";
import './App.css';

function App() {

  return (

    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Pages.Portal />} />
          <Route path="/portal" element={<Pages.Portal />} />
          <Route path="/signup" element={<Pages.SignUp />} />
          <Route path="/forgotpassword" element={<Pages.ForgotPassword />} />
          <Route path="/login" element={<Pages.Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Pages.Home />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Pages.Profile />} />
            </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );

}

export default App

