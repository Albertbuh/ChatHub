import styles from "./loginForm.module.css";
import { ChangeEventHandler, FormEventHandler, ReactElement } from "react";
import { IconType } from "react-icons";

export interface LoginInputInfo {
    type: string;
    value: string | number | readonly string[] | undefined;
    onChangeHandler: ChangeEventHandler<HTMLInputElement> | undefined;
    placeholder: string;
    icon: () => ReactElement<IconType>;
}

export interface FormProps {
    header: string;
    inputs: LoginInputInfo[];
    onSubmitHandler: FormEventHandler<HTMLFormElement> | undefined;
}

export default function Form(props: FormProps) {
    return (
        <div className={styles.wrapper}>
            <form action="" onSubmit={props.onSubmitHandler}>
                <h1>{props.header}</h1>
                {props.inputs.map((input) => (
                    <div className={styles.inputBox}>
                        <input
                            type={input.type}
                            value={input.value}
                            onChange={input.onChangeHandler}
                            placeholder={input.placeholder}
                            required
                        />
                        <div className={styles.icon}>
                            {input.icon()}
                        </div>
                    </div>
                ))}
                <button type="submit">NEXT</button>
            </form>
        </div>
    );
}

/* may be useful in future
                 <div className={styles.rememberForgot}>
                    <label>
                        <input type="checkbox" />Remember me
                    </label>
                    <a href="#">Forgot phone?</a>
                </div>

                <button type="submit">NEXT</button>

                <div className={styles.registerLink}>
                    <p>
                        Don&apos;t have Telegram account? <a href="#">Registration</a>
                    </p>
                </div>
*/
