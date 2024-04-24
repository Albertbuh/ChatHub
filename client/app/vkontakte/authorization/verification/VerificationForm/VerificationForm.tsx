import styles from './VerificationForm.module.css'
import { useState } from 'react';
import Link from 'next/link';

import { Bs123 } from "react-icons/bs";
import { navigate } from '../../login/actions';

interface VerificationFormProps {
    onVerificationSuccess: () => void;
}

const VerificationForm = ({ onVerificationSuccess }: VerificationFormProps) => {
    const [verificationCode, setverificationCode] = useState('');


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5041/api/v1.0/vk/login?login=f&password=f&code=${verificationCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Unable to verificate");
            }

            const data = await response.json();


                // Вызов функции обратного вызова
                onVerificationSuccess();
            
                console.log("Password not required", data);
                localStorage.setItem("storedVkAuthStage", "vkLogged");
                navigate('/vkontakte');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles.wrapper} >
            <form action="" onSubmit={handleSubmit}>
                <h1>Verification</h1>
                <div className={styles.inputBox}>
                    <input type="text" value={verificationCode} onChange={(e) => setverificationCode(e.target.value)} placeholder='Verification-code' required />
                    <Bs123 className={styles.icon}/>
                </div>

                <button type="submit">NEXT</button>

                <div className={styles.backwards}>
                    <p>
                        Incorrect phone?{' '}
                        <Link href="/vkontakte/authorization/login">
                            BACK
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default VerificationForm;
