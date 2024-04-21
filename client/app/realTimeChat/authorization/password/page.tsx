"use client";

import '../authorization.css';
import RegistrationForm from './RegistrationForm/RegistrationForm';
import Notification from '../../notification/notification';



export default function PasswordPage() {
    

    return (
      <div >
        <RegistrationForm />
        <Notification/>
      </div>
    );
  }
  