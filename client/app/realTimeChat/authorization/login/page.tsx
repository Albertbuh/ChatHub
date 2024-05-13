"use client";

import '../authorization.css'
import LoginForm from './LoginForm/LoginForm';
import Notification from '../../notification/notification';

interface LoginPageProps {
}

export default function LoginPage() {
  return (
    <div >
      <LoginForm />
      <Notification/>
    </div>
  );
}
