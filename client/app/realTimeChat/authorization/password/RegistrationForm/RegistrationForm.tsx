import styles from './RegistrationForm.module.css'
import { CgRename } from "react-icons/cg";
import { MdOutlineAlternateEmail, MdOutlinePassword } from "react-icons/md";
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/app/realTimeChat/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '@/app/realTimeChat/lib/upload';
import Link from 'next/link';


const RegistrationForm = () => {
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
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        const { username, email, password } = Object.fromEntries(formData);

        // VALIDATE UNIQUE USERNAME
        // const usersRef = collection(db, "users");
        // const q = query(usersRef, where("username", "==", username));
        // const querySnapshot = await getDocs(q);

        // if (!querySnapshot.empty) {
        //   return toast.warn("Select another username");
        // }

        try {
            const res = await createUserWithEmailAndPassword(auth, email.toString(), password.toString());

            const imgUrl = avatar.file ? await upload(avatar.file) : "/Nesterenkov.jpg";

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });

            toast.success("Account created. You can login now!");
        } catch (err: any) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.wrapper}>
            <form onSubmit={handleRegister}>
                <h1>Registration</h1>
                <div className={styles.loadAvatarBox}>
                    <label className={styles.avatarLabel} htmlFor="file">
                        <img className={styles.fileImg} src={avatar.url || "/Nesterenkov.jpg"} alt="" />
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
                    <input type="text" name='username' placeholder='Username' required />
                    <CgRename className={styles.icon} />
                </div>

                <div className={styles.inputBox}>
                    <input type="text" name='email' placeholder='Email' required />
                    <MdOutlineAlternateEmail className={styles.icon} />
                </div>

                <div className={styles.inputBox}>
                    <input type="text" name='password' placeholder='Password' required />
                    <MdOutlinePassword className={styles.icon} />
                </div>

                <button className={styles.button} disabled={loading} type="submit"> {loading ? "Loading" : "Sign Up"}</button>

                <div className={styles.registerLink}>
                    <p>Already have an account?
                        <Link href="/realTimeChat/authorization/login">
                            Login
                        </Link>
                    </p>
                </div>
            </form>

        </div>
    )
}

export default RegistrationForm;
