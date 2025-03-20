import React, { useState } from 'react';
import '../../App.css';
import './Auth.css';
import PlannerImage from '../../assets/Planner.png';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log('Signing in with', formData.email, formData.password);  
  };

  return (
    <div className="auth">
      <div className="white-container sign-in">
        <img className="logo" src={PlannerImage} alt="Planner logo"></img>
        <p className="auth-text">Sign In</p>
        <form onSubmit={handleSignIn}>
          <input
            className="auth input"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            className="auth input"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            className="large-button purple"
            type="submit"
          >
            SIGN IN
          </button>
        </form>
      </div>

    </div>
  );
}

export default SignIn;