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
import {
    GetPathToMediaFile,
    GetPathToMediaFileWithoutExtension,
    GetPathToProfilePhotoById,
} from "@/app/utils/filePaths";
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
    }, [currentDialog]);

    return (
        <div className={styles.chat}>
            <Top dialog={currentDialog} />
            <div className={styles.center}>
                {messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                        dialogId={currentDialog!.id}
                    />
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
    const [media, setMedia] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ message, media });
        setMessage("");
    };

    function handleImageClick() {
        var input = document.createElement("input");
        input.type = "file";
        input.onchange = () => {
            var files = input.files;
            if (files) {
                setMedia(files[0]);
            }
        };
        input.click();
    }

    return (
        <form action="" className={styles.bottom} onSubmit={handleSubmit}>
            <div className={styles.icons}>
                <CiImageOn className={styles.imgI} onClick={handleImageClick} />
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

interface MessageProps {
    message: IMessageInfo;
    dialogId: number;
}
function Message({ message: messageInfo, dialogId }: MessageProps) {
    const hasMedia = messageInfo.message.includes("TL.MessageMedia");
    const isOwn: boolean =
        messageInfo.sender.id.toString() === localStorage.getItem("id");
    const [mediaPath, setMediaPath] = useState("");
    let message = messageInfo.message.replace("TL.MessageMediaPhoto", "").replace(
        "TL.MessageMediaDocument",
        "",
    );
    useEffect(() => {
        const getFilepath = async () => {
            let newPath = await GetPathToMediaFileWithoutExtension(
                dialogId,
                messageInfo.id,
            );
            if (newPath) {
                setMediaPath(newPath);
            }
        };

        getFilepath();
    }, []);

    return (
        <div className={`${styles.message} ${isOwn ? styles.messageOwn : ""}`}>
            {!isOwn
                ? (
                    <img
                        className={styles.avatarImg}
                        src={GetPathToProfilePhotoById(messageInfo.sender.id)}
                        alt=""
                    />
                )
                : null}
            <div className={styles.texts}>
                {hasMedia ? <MessageMedia mediaPath={mediaPath} /> : null}
                {message.trim() !== "" ? <p className={styles.p}>{message}</p> : null}
                <Timestamp time={messageInfo.date} className={styles.span} />
            </div>
        </div>
    );
}

interface MediaProps {
    mediaPath: string;
}
function MessageMedia({ mediaPath }: MediaProps) {
    const imageTypes = ["jpeg", "jpg", "png", "webp"];
    var ext = mediaPath.split(".").pop() ?? "";
    if (imageTypes.includes(ext)) {
        return (
            <img
                className={styles.img}
                src={mediaPath}
            />
        );
    }

    const [isMuted, setIsMuted] = useState(true);
    if (ext === "mp4") {
        return (
            <video className={styles.img} src={mediaPath} autoPlay loop muted={isMuted} onClick={() => setIsMuted(!isMuted) }>
            </video>
        );
    }
    
    return "";
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
