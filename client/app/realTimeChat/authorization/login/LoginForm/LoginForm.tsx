import styles from './LoginForm.module.css'
import { CgRename } from "react-icons/cg";
import { MdOutlineAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/app/realTimeChat/lib/firebase';

import Link from 'next/link';



const LoginForm = () => {
    const [avatar, setAvatar] = useState<{
        file: File | null;
        url: string;
    }>({
        file: null,
        url: "",
    });


    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email.toString(), password.toString());
        } catch (err: any) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>

            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <div className={styles.inputBox}>
                    <input type="text" name='email' placeholder='Email' required />
                    <MdOutlineAlternateEmail className={styles.icon} />
                </div>

                <div className={styles.inputBox}>
                    <input type="text" name='password' placeholder='Password' required />
                    <MdOutlinePassword className={styles.icon} />
                </div>

                <div className={styles.rememberForgot}>
                    <label><input type="checkbox" />Remember me</label>
                    <a href="#">Forgot password?</a>
                </div>

                <button className={styles.button} disabled={loading} type="submit"> {loading ? "Loading" : "Sign In"}</button>

                <div className={styles.registerLink}>
                    <p>Don&apos;t have account? 
                        <Link href="/realTimeChat/authorization/password">
                            Registration
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;
