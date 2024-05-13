"use client";

import styles from "./chat.module.css";
import { BsFileEarmarkFill } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import Timestamp from "@/app/components/timestamp/timestamp";
import { IMediaInfoVK } from "../dto/IMediaInfo";
import { IMessageInfoVK } from "../dto/IMessageInfo";
import { IDialogInfoVK } from "../dto/IDialogInfo";
import Image from "next/image";
import { SendRequestData } from "@/app/models/sendRequestData";
import DialogHeader from "@/app/components/dialogHeader/dialogHeader";
import MessageSender from "@/app/components/messageSender/messageSender";
import ProfilePhoto from "@/app/components/profilePhoto/profilePhoto";

interface ChatProps {
    messages: IMessageInfoVK[];
    currentDialog: IDialogInfoVK | undefined;
    onSendSubmit: (data: SendRequestData) => void;
}

const Chat = ({ messages, currentDialog, onSendSubmit }: ChatProps) => {
    return (
        <div className={styles.chat}>
            {currentDialog && (
                <>
                    <DialogHeader
                        title={currentDialog.title}
                        pathToPhoto={currentDialog.photoUrl}
                    />
                    <MessagesContainer
                        messages={messages}
                        currentDialog={currentDialog}
                    />
                </>
            )}

            <MessageSender onSubmit={onSendSubmit} />
        </div>
    );
};

interface MessagesContainerProps {
    messages: IMessageInfoVK[];
    currentDialog: IDialogInfoVK | undefined;
}
function MessagesContainer(
    { messages, currentDialog }: MessagesContainerProps,
) {
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
    message: IMessageInfoVK;
    dialogId: number;
}
function Message({ message: messageInfo }: MessageProps) {
    const hasMedia: boolean = (messageInfo.media ? true : false) &&
        (messageInfo.media.type != "Undefined");
    const isOwn: boolean =
        messageInfo.sender.id.toString() === localStorage.getItem("vkontakte_id");

    return (
        <div className={`${styles.message} ${isOwn ? styles.messageOwn : ""}`}>
            {!isOwn
                ? (
                    <ProfilePhoto
                        className={styles.avatarImg}
                        src={messageInfo.sender.photoUrl}
                        alt={""}
                        width={"30"}
                        height={"30"}
                    />
                )
                : null}
            <div className={styles.texts}>
                <span className={styles.sendername}>{messageInfo.sender.username}</span>
                {hasMedia ? <MessageMedia mediaPath={messageInfo.media} /> : null}
                {messageInfo.message.trim() !== ""
                    ? <p className={styles.p}>{messageInfo.message}</p>
                    : null}
                <Timestamp time={messageInfo.date} className={styles.timestamp} />
            </div>
        </div>
    );
}

interface MediaProps {
    mediaPath: IMediaInfoVK;
}
function MessageMedia({ mediaPath }: MediaProps) {
    if (mediaPath.type == "Photo") {
        return (
            <Image
                className={styles.img}
                src={mediaPath.mediaUrl}
                alt="undefined media"
                width={0}
                height={0}
                sizes="100vw"
            />
        );
    }

    if (mediaPath.type == "Video") {
        return (
            <iframe
                src={mediaPath.mediaUrl}
                height={300}
                width={200}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture;"
                allowFullScreen
            >
            </iframe>
        );
    }

    if (mediaPath.type == "Doc") {
        const handleDownload = () => {
            const link = document.createElement("a");
            link.href = mediaPath.mediaUrl;
            link.download = "File";
            link.click();
        };
        let fileName = "File"; // Изначальное имя файла
        let filePath = "";
        const spaceIndex = mediaPath.mediaUrl.lastIndexOf(" ");
        if (spaceIndex !== -1) {
            fileName = mediaPath.mediaUrl.substring(spaceIndex);
            filePath = mediaPath.mediaUrl.substring(0, spaceIndex);
        }
        return (
            <a href={filePath} download={"File"} onClick={handleDownload}>
                <BsFileEarmarkFill
                    style={{ fontSize: 46, color: "#FFFFFF", marginRight: "10px" }}
                />
                <span style={{ color: "#FFFFFF", verticalAlign: "middle" }}>
                    {fileName}
                </span>
            </a>
        );
    }

    if (mediaPath.type == "VM") {
        return <audio controls src={mediaPath.mediaUrl}></audio>;
    }

    if (mediaPath.type == "Sticker") {
        return (
            <Image
                className={styles.img}
                src={mediaPath.mediaUrl}
                alt="undefined media"
                width={0}
                height={0}
                sizes="100vw"
            />
        );
    }

    return <h1>Undefined media</h1>;
}

export default Chat;
