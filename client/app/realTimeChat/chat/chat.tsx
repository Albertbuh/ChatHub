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
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { BsEmojiNeutral } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import { db } from "../lib/firebase";
import { useUserStore } from "../lib/userStore";
import upload from "../lib/upload";
import { useChatStore } from "../lib/chatStore";
import { format } from "timeago.js";

interface Chat {
    id: string;
    messages: Message[];
}

interface Message {
    senderId: string;
    text: string;
    createdAt: Date;
    img?: string;
}

const Chat = () => {
    const avatarPath = "./avatars/Hayasaka.jpg";

    const [chat, setChat] = useState<Chat | undefined>();
    const [open, setOpen] = useState(false);
    const [text, setText] = useState("");
    const [img, setImg] = useState<{
        file: File | null;
        url: string;
    }>({
        file: null,
        url: "",
    });

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
        useChatStore();
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [endRef, chat]);

    useEffect(() => {
        if (chatId) {
            const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
                setChat(res.data() as Chat);

                setChat(res.data() as Chat);
            });

            return () => {
                unSub();
            };
        }
    }, [chatId]);

    console.log(chat);

    // Not working for this moment
    // const handleEmoji = (e: { emoji: string }) => {
    //     setText((prev) => prev + e.emoji);
    //     setOpen(false);
    // };

    const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId ?? ""), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    //   ...(imgUrl && { img: imgUrl }),
                    ...({ img: imgUrl ?? "" }),
                }),
            });

            const userIDs = [currentUser.id, user.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c: { chatId: string }) => c.chatId === chatId,
                    );

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id
                        ? true
                        : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        } finally {
            setImg({
                file: null,
                url: "",
            });

            setText("");
        }
    };

    return (
        <div className={styles.chat}>
            <div className={styles.top}>
                <div className={styles.user}>
                    <img
                        className={styles.avatarImg}
                        src={user?.avatar || avatarPath}
                        alt=""
                    />
                    <div className={styles.texts}>
                        <span className={styles.span}>{user?.username}</span>
                        <p className={styles.p}>
                            She is just the best girl
                        </p>
                    </div>
                </div>
                <div className={styles.icons}>
                    <CiPhone className={styles.imgI} />
                    <CiVideoOn className={styles.imgI} />
                    <CiCircleInfo className={styles.imgI} />
                </div>
            </div>

            <div className={styles.center}>
                {chat?.messages?.map((message) => (
                    <div
                        className={message.senderId === currentUser?.id
                            ? styles.messageOwn
                            : styles.message}
                        key={message?.createdAt.toString()}
                    >
                        {message.senderId !== currentUser?.id && (
                            <img
                                className={styles.avatarImg}
                                src={user?.avatar || avatarPath}
                                alt=""
                            />
                        )}
                        <div className={styles.texts}>
                            {message.img &&
                                (
                                    <img className={styles.img} src={message.img} alt=""/>
                                )}
                            <p className={`${styles.p} ${styles.textSended}`}>
                                {message.text}
                            </p>
                            <span className={styles.span}>{format(message.createdAt)}</span>
                        </div>
                    </div>
                ))}
                {img.url && (
                    <div className={styles.messageOwn}>
                        <div className={styles.texts}>
                            <img className={styles.img} src={img.url} alt="" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>

            <div className={styles.bottom}>
                <div className={styles.icons}>
                    <label htmlFor="file">
                        <CiImageOn className={styles.imgI} />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleImg}
                    />
                    <CiCamera className={styles.imgI} />
                    <CiMicrophoneOn className={styles.imgI} />
                </div>
                <input
                    className={styles.input}
                    type="text"
                    placeholder={isCurrentUserBlocked || isReceiverBlocked
                        ? "You cannot send a message"
                        : "Type a message..."}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className={styles.emoji}>
                    <BsEmojiNeutral className={styles.imgI} />
                </div>
                <button
                    className={styles.sendButton}
                    onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
