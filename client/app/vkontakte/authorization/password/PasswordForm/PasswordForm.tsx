import styles from './PasswordForm.module.css'
import { useState } from 'react';
import Link from 'next/link';

import { BsFillKeyFill } from "react-icons/bs";

interface PasswordFormProps {
    onPasswordSuccess: () => void;
}

const PasswordForm = ({ onPasswordSuccess }: PasswordFormProps) => {
    const [PasswordCode, setPasswordCode] = useState('');


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5041/api/v1.0/telegram/login?info=${PasswordCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Unable to login with password");
            }

            const data = await response.json();
            console.log(data);
            if("id" in data) 
                localStorage.setItem("id", data.id);
            if("username" in data)
                localStorage.setItem("username", data.name);
            if("photoId" in data)
                localStorage.setItem("photoId", data.photoId);
            
            // Вызов функции обратного вызова
            onPasswordSuccess();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.wrapper} >
            <form action="" onSubmit={handleSubmit}>
                <h1>Password</h1>
                <div className={styles.inputBox}>
                    <input type="text" value={PasswordCode} onChange={(e) => setPasswordCode(e.target.value)} placeholder='Password-code' required />
                    <BsFillKeyFill  className={styles.icon} />
                </div>

                <div className={styles.rememberForgot}>
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button type="submit">AUTHORIZE</button>

                <div className={styles.backwards}>
                    <p>
                        Incorrect phone?{' '}
                        <Link href="/telegram/authorization/login">
                            LOGIN
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default PasswordForm;