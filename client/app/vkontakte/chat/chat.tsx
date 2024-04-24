"use client";

import styles from "./chat.module.css";
import { BsFileEarmarkFill } from 'react-icons/bs';
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
import { IMediaInfoVK } from "../dto/IMediaInfo"
import { IMessageInfoVK } from "../dto/IMessageInfo";
import { IDialogInfoVK } from "../dto/IDialogInfo";
import Image from "next/image";

interface ChatProps {
    messages: IMessageInfoVK[];
    currentDialog: IDialogInfoVK | undefined;
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
    messages: IMessageInfoVK[];
    currentDialog: IDialogInfoVK | undefined;
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
    message: IMessageInfoVK;
    dialogId: number;
}
function Message({ message: messageInfo, dialogId }: MessageProps) {
    const hasMedia: boolean = (messageInfo.media ? true : false) && (messageInfo.media.type != "Undefined");
    console.log(hasMedia);
    const isOwn: boolean =
        messageInfo.sender.id.toString() === localStorage.getItem("id");
   
    return (
        <div className={`${styles.message} ${isOwn ? styles.messageOwn : ""}`}>
            {!isOwn
                ? (
                    <img
                        className={styles.avatarImg}
                        src={messageInfo.sender.photoUrl}
                        alt={''}
                    />
                )
                : null}
            <div className={styles.texts}>
                <span className={styles.sendername}>{messageInfo.sender.username}</span>
                {hasMedia ? <MessageMedia mediaPath={messageInfo.media} /> : null}
                {messageInfo.message.trim() !== "" ? <p className={styles.p}>{messageInfo.message}</p> : null}
                <Timestamp time={messageInfo.date} className={styles.timestamp} />
            </div>
        </div>
    );
}

interface MediaProps {
    mediaPath: IMediaInfoVK;
}
function MessageMedia({ mediaPath }: MediaProps) {
    console.log("---");
    console.log(mediaPath.type);
    console.log("---");

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
        <iframe src={mediaPath.mediaUrl} height={300} width={200} allow="autoplay; encrypted-media; fullscreen; picture-in-picture;"allowFullScreen></iframe>
        );
    }

    if (mediaPath.type == "Doc"){
        const handleDownload = () => {
            const link = document.createElement("a");
            link.href = mediaPath.mediaUrl;
            link.download = "File";
            link.click();
          };
          let fileName = "File"; // Изначальное имя файла
          let filePath = ""
          const spaceIndex = mediaPath.mediaUrl.lastIndexOf(' ');
          console.log(mediaPath.mediaUrl);
          if (spaceIndex !== -1) {
            fileName = mediaPath.mediaUrl.substring(spaceIndex);
            filePath = mediaPath.mediaUrl.substring(0,spaceIndex);
          }
          return (
            <a href={filePath} download={"File"} onClick={handleDownload}>
  <BsFileEarmarkFill style={{ fontSize: 46, color: '#FFFFFF', marginRight: '10px' }} />
  <span style={{ color: '#FFFFFF', verticalAlign: 'middle' }}>{fileName}</span>
            </a>
          );
    }

    if(mediaPath.type == "VM"){
        return <audio controls src={mediaPath.mediaUrl}></audio>;
    }

    if(mediaPath.type == "Sticker"){
        return  <Image
        className={styles.img}
        src={mediaPath.mediaUrl}
        alt="undefined media"
        width={0}
        height={0}
        sizes="100vw"
    />;
    }
    

    return <h1>Undefined media</h1>;
}

interface TopProps {
    dialog: IDialogInfoVK | undefined;
}
function Top({ dialog }: TopProps) {
    if (!dialog) {
        return null;
    }

    return (
        <div className={styles.top}>
            <div className={styles.user}>
                <Image
                    src={dialog.photoUri}
                    width={"60"}
                    height={"60"}
                    alt=""
                    className={styles.avatarImg}
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