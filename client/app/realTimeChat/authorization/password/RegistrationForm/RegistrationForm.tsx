import styles from './PasswordForm.module.css'
import { useState } from 'react';
import Link from 'next/link';

import { BsFillKeyFill } from "react-icons/bs";
import { CgRename } from 'react-icons/cg';
import { MdOutlineAlternateEmail, MdOutlinePassword } from 'react-icons/md';

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

            // Вызов функции обратного вызова
            onPasswordSuccess();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.wrapper}>
            <form action="" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className={styles.inputBox}>
                    <input type="text" placeholder='Username' required />
                    <CgRename className={styles.icon} />
                </div>

                <div className={styles.inputBox}>
                    <input type="text" placeholder='Email' required />
                    <MdOutlineAlternateEmail className={styles.icon} />
                </div>

                <div className={styles.inputBox}>
                    <input type="text"  placeholder='Password' required />
                    <MdOutlinePassword className={styles.icon} />
                </div>

                <div className={styles.rememberForgot}>
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot username?</a>
                </div>

                <button type="submit">Sign In</button>

                <div className={styles.registerLink}>
                    <p>Don&apos;t have account? <a href="#">Registration</a></p>
                </div>
            </form>
        </div>
    )
}

export default PasswordForm;
