"use client";

import '../authorization.css';
import PasswordForm from './PasswordForm/PasswordForm';
import { useState } from 'react';



export default function PasswordPage() {
  const [heading, setHeading] = useState('Password TEST');
    
  const handlePasswordSuccess = () => {
    setHeading('Success');
  };

    return (
      <div >
        <h1>{heading}</h1>
        <PasswordForm onPasswordSuccess={handlePasswordSuccess} />
      </div>
    );
  }
  