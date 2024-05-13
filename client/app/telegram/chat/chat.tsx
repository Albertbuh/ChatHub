"use client";

import styles from "./chat.module.css";

import { useEffect, useRef, useState } from "react";
import { IMessageInfo } from "@/app/models/dto/IMessageInfo";
import {
    GetPathToMediaFileWithoutExtension,
    GetPathToProfilePhotoById,
} from "@/app/utils/filePaths";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import Timestamp from "@/app/components/timestamp/timestamp";
import { SendRequest } from "@/app/models/sendRequest";
import DialogHeader from "@/app/components/dialogHeader/dialogHeader";
import MessageSender from "@/app/components/messageSender/messageSender";
import ProfilePhoto from "@/app/components/profilePhoto/profilePhoto";

interface ChatProps {
    messages: IMessageInfo[];
    currentDialog: IDialogInfo | undefined;
    onSendSubmit: (data: SendRequest) => void;
}

const Chat = ({ messages, currentDialog, onSendSubmit }: ChatProps) => {
    return (
        <div className={styles.chat}>
            {currentDialog && (
                <DialogHeader
                    title={currentDialog.title}
                    pathToPhoto={GetPathToProfilePhotoById(
                        currentDialog.id,
                        "telegram_tag",
                    )}
                />
            )}
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

interface MessageProps {
    message: IMessageInfo;
    dialogId: number;
}
function Message({ message: messageInfo, dialogId }: MessageProps) {
    const hasMedia = messageInfo.message.includes("TL.MessageMedia");
    const isOwn: boolean =
        messageInfo.sender.id.toString() === localStorage.getItem("telegram_id");
    const [mediaPath, setMediaPath] = useState("");
    let message = messageInfo.message.replace("TL.MessageMediaPhoto", "").replace(
        "TL.MessageMediaDocument",
        "",
    ).replace("TL.MessageMediaWebPage", "");
    
    const [profilePath] = useState(
        GetPathToProfilePhotoById(messageInfo.sender.id, "telegram_tag"),
    );

    useEffect(() => {
        const getFilepath = async () => {
            let newPath = await GetPathToMediaFileWithoutExtension(
                dialogId,
                messageInfo.id,
                "telegram_tag",
            );
            if (newPath) {
                setMediaPath(newPath);
            } else {
                setMediaPath("/avatars/noImage.png");
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
                    <ProfilePhoto
                        className={styles.avatarImg}
                        src={profilePath}
                        alt={""}
                        width={"30"}
                        height={"30"}
                        />
                )
                : null}
            <div className={styles.texts}>
                <span className={styles.sendername}>
                    {!isOwn ? messageInfo.sender.username : ""}
                </span>
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
        const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|(?:v|embed)\/)|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})$/;
        if(youtubeRegex.test(mediaPath)) {
            mediaPath = mediaPath.replace("watch?v=", "embed/").replace("shorts", "embed");
        }
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

export default Chat;
