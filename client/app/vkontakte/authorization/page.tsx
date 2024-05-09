"use client";
import { Bs123, BsFillKeyFill, BsFillTelephoneFill } from "react-icons/bs";
import { ChangeEvent, useRef, useState } from "react";
import Form, { FormProps } from "@/app/components/loginForm/loginForm";
import { loginRequest } from "@/app/utils/getRequests";

enum LoginState {
    Phone = 0,
    Verification = 1,
}

export default function Page() {
    const [firstLoginField, setFirstLoginField] = useState("");
    const [secondLoginField, setSecondLoginField] = useState("");
    const [thirdLoginField, setThirdLoginField] = useState("");
    const currentLoginState = useRef(LoginState.Phone);

    function onChangeFirstHandler(e: ChangeEvent<HTMLInputElement>) {
        setFirstLoginField(e.target.value);
    }
    function onChangeSecondHandler(e: ChangeEvent<HTMLInputElement>) {
        setSecondLoginField(e.target.value);
    }
    function onChangeThirdHandler(e: ChangeEvent<HTMLInputElement>) {
        setThirdLoginField(e.target.value);
    }
    
    const formLoginProps: FormProps = {
        header: "Login",
        inputs: [
            {
                type: "text",
                value: firstLoginField,
                onChangeHandler: onChangeFirstHandler,
                placeholder: "Enter phone number",
                icon: () => <BsFillTelephoneFill />,
            },
            {
                type: "password",
                value: secondLoginField,
                onChangeHandler: onChangeSecondHandler,
                placeholder: "Enter password",
                icon: () => <BsFillKeyFill/>,
            }
        ],
        onSubmitHandler: handleSubmit,
    };
    
    const formVerificationProps: FormProps = {
        header: "Verification",
        inputs: [
            {
                type: "number",
                value: thirdLoginField,
                onChangeHandler: onChangeThirdHandler,
                placeholder: "Enter verification code",
                icon: () => <Bs123 />,
            },
        ],
        onSubmitHandler: handleSubmit,
    };
    

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            var isLoggedIn = await loginRequest(
                "vkontakte",
                `http://localhost:5041/api/v1.0/vk/login?login=${firstLoginField}&password=${secondLoginField}&code=${thirdLoginField}`,
            );
            if (!isLoggedIn) {
                currentLoginState.current = currentLoginState.current + 1;
            }
        } catch (error) {
            console.log(error);
        }
        //useRef not trigger rerender so we need to change some useState
        //need to fix in future
        setFirstLoginField("");
        setSecondLoginField("");
    }

    let statesOfLogin: Record<LoginState, FormProps> = {
        [LoginState.Phone]: formLoginProps,
        [LoginState.Verification]: formVerificationProps,
    };

    return (
        <Form
            header={statesOfLogin[currentLoginState.current].header}
            inputs={statesOfLogin[currentLoginState.current].inputs}
            onSubmitHandler={handleSubmit}
        />
    );
}
