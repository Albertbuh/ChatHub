"use client";

import '../authorization.css';
import { navigate } from '../login/actions';
import VerificationForm from './VerificationForm/VerificationForm';

import { useContext } from 'react';

export default function VerificationPage() {

    
  const handleVerificationSuccess = () => {
    console.log('Verification success');
    console.log('New auth stage:', 'vkLogged');
    navigate('/vkontakte');
  };

    return (
      <div >
        <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
      </div>
    );
  }
  