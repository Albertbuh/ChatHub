"use client";

import '../authorization.css'
import LoginForm from './LoginForm/LoginForm';
import Notification from '../../notification/notification';

interface LoginPageProps {
}

export default function LoginPage() {
  
  const handleLoginSuccess = () => {

    console.log('Login success');
    console.log('New auth stage:', 'verification');
  };

  return (
    <div >
      <LoginForm />
      <Notification/>
    </div>
  );
}
