"use client";

import { useState } from 'react';
import LoginForm from '../telegram/authorization/login/LoginForm/LoginForm';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleLoginSuccess = () => {
    // Перенаправление на страницу VerificationForm.tsx
  };

  return (
    <div>
      <h1>Login TEST</h1>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </div>
  );
}