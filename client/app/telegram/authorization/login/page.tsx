"use client";

import { useState } from 'react';
import '../authorization.css'
import LoginForm from './LoginForm/LoginForm';
import { navigate } from './actions'


//TODO: FIX colorful background
//TODO: remake verificationForm
export default function LoginPage() {
  const [heading, setHeading] = useState('Login TEST');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLoginSuccess = () => {
    setHeading('SUUUS');
    navigate('/telegram/authorization/verification');
  };


  return (
    <div>
      <h1>{heading}</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}
