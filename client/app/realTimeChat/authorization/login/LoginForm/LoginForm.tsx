import styles from './LoginForm.module.css'
import { BsFillTelephoneFill } from "react-icons/bs";
import { CgRename } from "react-icons/cg";
import { MdOutlineAlternateEmail, MdOutlinePassword  } from "react-icons/md";
import { useState } from 'react';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
    const [loading, setLoading] = useState(false);


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:5041/api/v1.0/telegram/login?info=${Email}`, {
                method: "POST",
                headers: {  
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Unable to login");
            }

            const data = await response.json();

            if (data.statusCode === 200 && data.message === "Send verification code") {
                // Вызов функции обратного вызова
                onLoginSuccess();
            } else {
                console.log("Unexpected response from server:", data);
            }
            
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
                    <input type="text" placeholder='Password' required />
                    <MdOutlinePassword className={styles.icon} />
                </div>

                <div className={styles.rememberForgot}>
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot username?</a>
                </div>

                <button disabled={loading} type="submit"> {loading ? "Loading" : "Sign In"}</button>

                <div className={styles.registerLink}>
                    <p>Don&apos;t have account? <a href="#">Registration</a></p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;
