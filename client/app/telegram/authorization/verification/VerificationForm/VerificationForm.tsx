import "./VerificationForm.css"
import { useState } from 'react';
import Link from 'next/link';



interface VerificationFormProps {
    onVerificationSuccess: () => void;
}

const VerificationForm = ({ onVerificationSuccess }: VerificationFormProps) => {
    const [verificationCode, setverificationCode] = useState('');


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5041/api/v1.0/telegram/login?info=${verificationCode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Unable to login");
            }

            const data = await response.json();

            // Вызов функции обратного вызова
            onVerificationSuccess();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="wrapper" >
            <form action="" onSubmit={handleSubmit}>
                <h1>Verification</h1>
                <div className="input-box">
                    <input type="text" value={verificationCode} onChange={(e) => setverificationCode(e.target.value)} placeholder='Verification-code' required />
                </div>

                <button type="submit">NEXT</button>

                <div className="backwards">
                    <p>
                        Incorrect phone?{' '}
                        <Link href="/telegram/authorization/login">
                            BACK
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default VerificationForm;
