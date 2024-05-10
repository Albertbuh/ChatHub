import { Suspense } from "react";
import styles from "./chatField.module.css";
import Timestamp from "../timestamp/timestamp";
import ProfilePhoto from "../profilePhoto/profilePhoto";

interface ChatFieldProps {
    title: string;
    pathToPhoto: string;
    sender: string;
    message: string;
    date: string;
}

export default function ChatField(props: ChatFieldProps) {
    return (
        <div className={styles.item}>
            <Suspense fallback={<p>loading...</p>}>
                <ProfilePhoto
                    className={styles.avatarImg}
                    src={props.pathToPhoto}
                    width={"50"}
                    height={"50"}
                    alt={""}
                />
            </Suspense>
            <div className={styles.texts}>
                <span className={styles.title}>{props.title}</span>
                <p className={styles.p}>
                    <span className={styles.sendername}>
                        {props.sender}:
                    </span>&nbsp;
                    {props.message}
                </p>
                <Timestamp time={props.date} className={styles.time} />
            </div>
        </div>
    );
}
