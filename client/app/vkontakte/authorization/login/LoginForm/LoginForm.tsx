import styles from "./LoginForm.module.css";
import { BsFillKeyFill, BsFillTelephoneFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { dir } from "console";
import { navigate } from "../actions";

interface LoginFormProps {
    onLoginSuccess: () => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await fetch(
                `http://localhost:5041/api/v1.0/vk/login?login=${phoneNumber}&password=${PasswordCode}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error("Unable to login");
            }

            
            const responseData = await response.json();

            console.log(responseData);
            //TODO: Some logic for correct verification answer ???
            if (responseData.statusCode === 200 && responseData.message === "Enter autentification code") {
                onLoginSuccess();
                localStorage.setItem("storedVkAuthStage", "verification");
                console.log("vk setted store: verification :", localStorage.getItem("storedVkAuthStage"))
            }
            
            if (responseData.statusCode === 200 && responseData.data != null) {
                let data = responseData.data as UserData;
                localStorage.setItem("vk_id", data.id.toString());
                localStorage.setItem("vk_username", data.username);
                localStorage.setItem("vk_tag", data.tag);
                localStorage.setItem("vk_photoUrl", data.photoUrl);
                localStorage.setItem("storedVkAuthStage", "vkLogged")
                
                navigate('/vkontakte');
                // localStorage.setItem("storedVkAuthStage", "verification")
            } else {
                console.log("Unexpected response from server:", responseData);
            }
        } catch (error) {
            console.log(error);
        }
    }
    
    interface UserData {
        id: number;
        username: string;
        tag: string;
        photoUrl: string;
    }

    const [PasswordCode, setPasswordCode] = useState('');


    const passwordInputRef = useRef<HTMLInputElement>(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        console.log('Show password')
        setPasswordVisible(!passwordVisible);
        if (passwordInputRef.current) {
          passwordInputRef.current.type = passwordVisible ? "password" : "text";
        }
      };

    return (
        <div className={styles.wrapper}>
            <form action="" onSubmit={handleSubmit}>
                <h1>Login</h1>
                <div className={styles.inputBox}>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => {setPhoneNumber(e.target.value);}}
                        placeholder="Phone-Number"
                        required
                    />
                    <BsFillTelephoneFill className={styles.icon} />
                </div>

                <div className={styles.inputBox}>
                    <input type={passwordVisible ? "text" : "password" }  value={PasswordCode} onChange={(e) => setPasswordCode(e.target.value)} placeholder='Password-code' required ref={passwordInputRef}/>
                    <BsFillKeyFill  className={styles.icon} onClick={togglePasswordVisibility} />
                </div>


                <div className={styles.rememberForgot}>
                    <label>
                        <input type="checkbox" />Remember me
                    </label>
                    <a href="#">Forgot phone?</a>
                </div>

                <button type="submit">NEXT</button>

                <div className={styles.registerLink}>
                    <p>
                        Don&apos;t have VK account? <a href="#">Registration</a>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
