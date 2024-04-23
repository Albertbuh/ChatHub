"use client";

import '../authorization.css'
import LoginForm from './LoginForm/LoginForm';
import { navigate } from './actions'

import { useContext } from 'react';
import { AuthStageContext } from '../../contexts/AuthContext';


interface LoginPageProps {
}


//TODO: FIX colorful background
//TODO: remake verificationForm
export default function LoginPage() {
  const { setAuthStage } = useContext(AuthStageContext);
  
  const handleLoginSuccess = () => {
    setAuthStage('verification');
    navigate('/telegram/authorization/verification');
  };


  return (
    <div >
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}
