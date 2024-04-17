"use client";

import '../authorization.css';
import { navigate } from '../login/actions';
import PasswordForm from './PasswordForm/PasswordForm';



export default function PasswordPage() {
    
  const handlePasswordSuccess = () => {
    navigate('/telegram');
    setAuthStage('telegramLogged');
  };

    return (
      <div >
        <PasswordForm onPasswordSuccess={handlePasswordSuccess} />
      </div>
    );
  }

function setAuthStage(arg0: string) {
  throw new Error('Function not implemented.');
}
  