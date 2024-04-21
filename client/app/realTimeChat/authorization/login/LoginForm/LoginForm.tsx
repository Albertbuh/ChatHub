import styles from './LoginForm.module.css'
import { CgRename } from "react-icons/cg";
import { MdOutlineAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { useState } from 'react';


const LoginForm = () => {
    const [avatar, setAvatar] = useState<{
        file: File | null;
        url: string;
    }>({
        file: null,
        url: "",
    });


    const [loading, setLoading] = useState(false);

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    }

    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleRegister}>
                <h1>Registration</h1>
                <div className={styles.loadAvatarBox}>
                    <label htmlFor="file">
                        <img src={avatar.url || "./pidr.png"} alt="" />
                        Upload an image
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleAvatar}
                    />
                </div>
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

                <button disabled={loading} type="submit"> {loading ? "Loading" : "Sign Up"}</button>

                <div className={styles.registerLink}>
                    <p>Already have an account? <a href="#">Login</a></p>
                </div>
            </form>

            {/* <form onSubmit={handleLogin}>
                <h1>Login</h1>
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
                    <a href="#">Forgot password?</a>
                </div>

                <button disabled={loading} type="submit"> {loading ? "Loading" : "Sign In"}</button>

                <div className={styles.registerLink}>
                    <p>Don&apos;t have account? <a href="#">Registration</a></p>
                </div>
            </form> */}
        </div>
    )
}

export default LoginForm;
