"use client";

import '../authorization.css';
import VerificationForm from './VerificationForm/VerificationForm';
import { useState } from 'react';


export default function VerificationPage() {
  const [heading, setHeading] = useState('Verification TEST');
    
  const handleVerificationSuccess = () => {
    setHeading('Success');
  };

    return (
      <div>
        <h1>{heading}</h1>
        <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
      </div>
    );
  }
  