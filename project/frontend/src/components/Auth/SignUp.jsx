import React, { useState } from 'react';
import '../../App.css';
import './Auth.css';
import PlannerImage from '../../assets/Planner.png';

function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log('Signing in with', formData.email, formData.password);
  };

  return (
    <div className="auth">
      <div className="white-container sign-up">
        <img className="logo" src={PlannerImage} alt="Planner logo"></img>
        <p className="auth-text">Sign Up</p>
        <form onSubmit={handleSignUp}>
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
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            className="auth input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button
            className="large-button purple"
            type="submit"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;