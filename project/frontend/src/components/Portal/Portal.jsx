import React from 'react';
import '../../App.css';
import './Portal.css';
import { useNavigate } from 'react-router-dom';
import PlannerImage from '../../assets/Planner.png';

function Portal() {
  const navigate = useNavigate();
  return (
    <div className="portal">
      <div className="white-container portal">
        <img className="logo" src={PlannerImage} alt="Planner logo"></img>
        <button className="large-button white" onClick={() => navigate('/auth/signin')}>SIGN IN</button>
        <button className="large-button purple" onClick={() => navigate('/auth/signup')}>SIGN UP</button>
      </div>
    </div>
  );
}

export default Portal;
