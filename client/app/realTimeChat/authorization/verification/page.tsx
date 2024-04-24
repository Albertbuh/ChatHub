"use client";

import '../authorization.css';
import { navigate } from '../login/actions';
import VerificationForm from './VerificationForm/VerificationForm';


export default function VerificationPage() {

    
  const handleVerificationSuccess = () => {
    navigate('/telegram/authorization/password');
  };

    return (
      <div >
        <VerificationForm onVerificationSuccess={handleVerificationSuccess} />
      </div>
    );
  }
  
