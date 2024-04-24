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
    GetPathToMediaFileWithoutExtension,
    GetPathToProfilePhotoById,
} from "@/app/utils/filePaths";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import Timestamp from "@/app/components/timestamp/timestamp";
import { SendData } from "../page";
import Image from "next/image";
import { setPriority } from "os";

interface ChatProps {
    messages: IMessageInfo[];
    currentDialog: IDialogInfo | undefined;
    onSendSubmit: (data: SendData) => void;
}

const Chat = ({ messages, currentDialog, onSendSubmit }: ChatProps) => {
    return (
        <div className={styles.chat}>
            <Top dialog={currentDialog} />
            <MessagesContainer messages={messages} currentDialog={currentDialog} />
            <MessageSender onSubmit={onSendSubmit} />
        </div>
    );
};

interface MessagesContainerProps {
    messages: IMessageInfo[];
    currentDialog: IDialogInfo | undefined;
}
function MessagesContainer(
    { messages, currentDialog }: MessagesContainerProps,
) {
    if (!currentDialog) {
        return null;
    }

    const messagesView = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messagesView.current != null) {
            messagesView.current.scrollTo({ top: 10000 });
        }
    }, [messages]);

    return (
        <div className={styles.center} ref={messagesView}>
            {messages.length > 0
                ? messages.map((message) => (
                    <Message
                        key={message.id}
                        message={message}
                        dialogId={currentDialog!.id}
                    />
                ))
                : <h1 className={styles.suspense}>Loading...</h1>}
        </div>
    );
}
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
    ).replace("TL.MessageMediaWebPage", "");
    const [profilePath, setProfilePath] = useState(GetPathToProfilePhotoById(messageInfo.sender.id));


    useEffect(() => {
        const getFilepath = async () => {
            let newPath = await GetPathToMediaFileWithoutExtension(
                dialogId,
                messageInfo.id,
            );
            if (newPath) {
                setMediaPath(newPath);
            }
            else {
                setMediaPath('/avatars/noImage.png');
            }
        };

        if (hasMedia) {
            let isWeb = messageInfo.message.includes("TL.MessageMediaWebPage");
            if (!isWeb) {
                getFilepath();
            } else {
                setMediaPath(message.trim());
            }
        }
    }, []);

    return (
        <div className={`${styles.message} ${isOwn ? styles.messageOwn : ""}`}>
            {!isOwn
                ? (
                    <img
                        className={styles.avatarImg}
                        src={profilePath}
                        onError={() => setProfilePath("/avatars/defaultProfile.jpeg")}
                        alt=""
                    />
                )
                : null}
            <div className={styles.texts}>
                <span className={styles.sendername}>{!isOwn ? messageInfo.sender.username : ""}</span>
                {hasMedia ? <MessageMedia mediaPath={mediaPath} /> : null}
                {message.trim() !== "" ? <p className={styles.p}>{message}</p> : null}
                <Timestamp time={messageInfo.date} className={styles.timestamp} />
            </div>
        </div>
    );
}

interface MediaProps {
    mediaPath: string;
}
function MessageMedia({ mediaPath }: MediaProps) {
    if (mediaPath.includes("https")) {
        return (
            <iframe
                src={mediaPath}
            />
        );
    }

    const imageTypes = ["jpeg", "jpg", "png", "webp"];
    var ext = mediaPath.split(".").pop() ?? "";
    if (imageTypes.includes(ext)) {
        return (
            <img
                className={styles.img}
                src={mediaPath}
                alt=""
                width={0}
                height={0}
                sizes="100vw"
            />
        );
    }

    const videoTypes = ["mp4", "webm"];
    const [isMuted, setIsMuted] = useState(true);
    if (videoTypes.includes(ext)) {
        return (
            <video
                className={styles.img}
                playsInline
                autoPlay
                muted={isMuted}
                loop
                onClick={() => setIsMuted(!isMuted)}
            >
                <source src={mediaPath} type={`video/${ext}`} />
            </video>
        );
    }

    if (ext === "mp3" || ext === "ogg") {
        return <audio controls src={mediaPath}></audio>;
    }

    return <h1>Undefined media</h1>;
}

interface TopProps {
    dialog: IDialogInfo | undefined;
}
function Top({ dialog }: TopProps) {
    if (!dialog) {
        return null;
    }

    const [profilePath, setProfilePath] = useState(GetPathToProfilePhotoById(dialog.id));
    useEffect(() => {
       setProfilePath(GetPathToProfilePhotoById(dialog.id)); 
    }, [dialog]);
    
    return (
        <div className={styles.top}>
            <div className={styles.user}>
                <Image
                    src={profilePath}
                    width={"60"}
                    height={"60"}
                    alt=""
                    className={styles.avatarImg}
                    onError={() => setProfilePath("/avatars/defaultProfile.jpeg")}
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
