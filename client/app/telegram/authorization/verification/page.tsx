"use client";

import { AuthStageContext } from '../../contexts/AuthContext';
import '../authorization.css';
import { navigate } from '../login/actions';
import VerificationForm from './VerificationForm/VerificationForm';

import { useContext } from 'react';

export default function VerificationPage() {
  const { setAuthStage } = useContext(AuthStageContext);

    
  const handleVerificationSuccess = () => {
    console.log('Verification success');
    console.log('New auth stage:', 'password');
    setAuthStage('password');
    navigate('/telegram/authorization/password');
  };

    return (
      <div >
        <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
      </div>
    );
  }
  