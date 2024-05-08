"use client";
import { Bs123, BsFillKeyFill, BsFillTelephoneFill } from "react-icons/bs";
import { ChangeEvent, useRef, useState } from "react";
import Form, { FormProps } from "@/app/components/loginForm/loginForm";
import { loginRequest } from "@/app/utils/getRequests";

enum LoginState {
    Phone = 0,
    Verification = 1,
    Password = 2,
}

export default function Page() {
    const [firstLoginField, setFirstLoginField] = useState("");
    const currentLoginState = useRef(LoginState.Phone);

    function onChangeHandler(e: ChangeEvent<HTMLInputElement>) {
        setFirstLoginField(e.target.value);
    }
    const formPhoneProps: FormProps = {
        header: "Login",
        inputs: [
            {
                type: "text",
                value: firstLoginField,
                onChangeHandler: onChangeHandler,
                placeholder: "Enter phone number",
                icon: () => <BsFillTelephoneFill />,
            },
        ],
        onSubmitHandler: handleSubmit,
    };
    const formVerificationProps: FormProps = {
        header: "Verification",
        inputs: [
            {
                type: "number",
                value: firstLoginField,
                onChangeHandler: onChangeHandler,
                placeholder: "Enter verification code",
                icon: () => <Bs123 />,
            },
        ],
        onSubmitHandler: handleSubmit,
    };
    const formPasswordProps: FormProps = {
        header: "Password",
        inputs: [
            {
                type: "password",
                value: firstLoginField,
                onChangeHandler: onChangeHandler,
                placeholder: "Enter your password",
                icon: () => <BsFillKeyFill />,
            },
        ],
        onSubmitHandler: handleSubmit,
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            var isLoggedIn = await loginRequest(
                "telegram",
                `http://localhost:5041/api/v1.0/telegram/login?info=${firstLoginField}`,
            );
            if (!isLoggedIn) {
                currentLoginState.current = currentLoginState.current + 1;
            }
        } catch (error) {
            console.log(error);
        }
        setFirstLoginField("");
    }

    let statesOfLogin: Record<LoginState, FormProps> = {
        [LoginState.Phone]: formPhoneProps,
        [LoginState.Verification]: formVerificationProps,
        [LoginState.Password]: formPasswordProps,
    };

    return (
        <Form
            header={statesOfLogin[currentLoginState.current].header}
            inputs={statesOfLogin[currentLoginState.current].inputs}
            onSubmitHandler={handleSubmit}
        />
    );
}
