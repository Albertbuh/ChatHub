"use client";

import styles from "./chat.module.css";

import {
    CiCamera,
    CiCircleInfo,
    CiImageOn,
    CiMicrophoneOn,
    CiPhone,
    CiVideoOn,
} from "react-icons/ci";
import { BsEmojiNeutral } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { IMessageInfo } from "@/app/models/dto/IMessageInfo";
import { GetPathToProfilePhotoById } from "@/app/utils/filePaths";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import Timestamp from "@/app/components/timestamp/timestamp";
import { SendData } from "../page";

interface ChatProps {
    messages: IMessageInfo[];
    currentDialog: IDialogInfo | undefined;
    onSendSubmit: (data: SendData) => void;
}
const Chat = ({ messages, currentDialog, onSendSubmit }: ChatProps) => {
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    console.log("Messages: ");
    console.log(messages);
    return (
        <div className={styles.chat}>
            <Top dialog={currentDialog} />
            <div className={styles.center}>
                {messages.map((message) => (
                    message.sender.id === Number(localStorage.getItem("id"))
                        ? <OwnMessage message={message} />
                        : (
                            <Message
                                message={message}
                                avatarPath={GetPathToProfilePhotoById(message.sender.id)}
                            />
                        )
                ))}
            </div>
            <MessageSender onSubmit={onSendSubmit} />
        </div>
    );
};

interface MessageSenderProps {
    onSubmit: (data: SendData) => void;
}
function MessageSender({ onSubmit }: MessageSenderProps) {
    const [message, setMessage] = useState("");
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({message, mediaFilepath:""});
        setMessage("");
    };
    
    return (
        <form action="" className={styles.bottom} onSubmit={handleSubmit}>
            <div className={styles.icons}>
                <CiImageOn className={styles.imgI} />
                <CiCamera className={styles.imgI} />
                <CiMicrophoneOn className={styles.imgI} />
            </div>
            <input
                className={styles.input}
                value={message}
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
            />
            <div className={styles.emoji}>
                <BsEmojiNeutral className={styles.imgI} />
            </div>
            <button
                type="submit"
                className={styles.sendButton}
            >
                Send
            </button>
        </form>
    );
}

interface OwnMessageProps {
    message: IMessageInfo;
}
function OwnMessage({ message }: OwnMessageProps) {
    return (
        <div className={`${styles.message} ${styles.messageOwn}`}>
            <div className={styles.texts}>
                <p className={styles.p}>
                    {message.message}
                </p>
                <Timestamp time={message.date} className={styles.span} />
            </div>
        </div>
    );
}

interface MessageProps {
    message: IMessageInfo;
    avatarPath: string;
}
function Message({ message, avatarPath }: MessageProps) {
    return (
        <div className={styles.message}>
            <img className={styles.avatarImg} src={avatarPath} alt="" />
            <div className={styles.texts}>
                <p className={styles.p}>{message.message}</p>
                <Timestamp time={message.date} className={styles.span} />
            </div>
        </div>
    );
}

interface TopProps {
    dialog: IDialogInfo | undefined;
}
function Top({ dialog }: TopProps) {
    if (!dialog) {
        return null;
    }

    return (
        <div className={styles.top}>
            <div className={styles.user}>
                <img
                    className={styles.avatarImg}
                    src={GetPathToProfilePhotoById(dialog.id)}
                    alt=""
                />
                <div className={styles.texts}>
                    <span className={styles.span}>{dialog.title}</span>
                    <p className={styles.p}>
                        Have a good day, you better than you think!
                    </p>
                </div>
            </div>
            <div className={styles.icons}>
                <CiPhone className={styles.imgI} />
                <CiVideoOn className={styles.imgI} />
                <CiCircleInfo className={styles.imgI} />
            </div>
        </div>
    );
}

export default Chat;
