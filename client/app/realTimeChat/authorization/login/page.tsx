"use client";

import '../authorization.css'
import LoginForm from './LoginForm/LoginForm';

interface LoginPageProps {
}

export default function LoginPage() {
  
  const handleLoginSuccess = () => {

  };

  return (
    <div >
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}
