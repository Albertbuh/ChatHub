"use client"

import styles from './chatList.module.css'

import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { Key, ReactNode, useEffect, useState } from 'react';
import AddUser from './addUser/addUser';
import { useUserStore } from '../../lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';

interface Chat {
    chatId: string;
    receiverId: string;
    lastMessage: string;
    updatedAt: number;
    isSeen: boolean;
}

interface User {
    id: string;
    username: string;
    avatar?: string;
    blocked: string[];
    background: string;
}

interface ChatWithUser extends Chat {
    user: User;
}

const ChatList = () => {
    const avatarPath = './avatars/Hayasaka.jpg';
    const [addMode, setAddMode] = useState(false);

    const [chats, setChats] = useState<ChatWithUser[]>([]);
    const { currentUser } = useUserStore();
    const [input, setInput] = useState("");
    const { chatId, changeChat } = useChatStore();


    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, "userchats", currentUser.id),
            async (res) => {
                const items = res.data()?.chats;

                if (!items) return;

                const promises = items.map(async (item: Chat) => {
                    const userDocRef = doc(db, "users", item.receiverId);
                    const userDocSnap = await getDoc(userDocRef);

                    const user = userDocSnap.data() as User;

                    return { ...item, user };
                });

                const chatData = await Promise.all(promises);

                setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        );
        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat: ChatWithUser) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredChats = chats.filter((c) =>
        c.user.username.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className={styles.chatList}>
            <div className={styles.search}>
                <div className={styles.searchBar}>
                    <IoIosSearch className={styles.img} />
                    <input className={styles.input} type='text' placeholder='Search' onChange={(e) => setInput(e.target.value)} />
                </div>
                {addMode ? (
                    <FaMinus className={`${styles.minus} ${styles.add}`}
                        onClick={() => setAddMode((prev) => !prev)} />
                ) : (
                    <FaPlus className={styles.add}
                        onClick={() => setAddMode((prev) => !prev)} />
                )}
            </div>

            {filteredChats.map((chat) => (
                <div
                    className={styles.item}
                    key={chat.chatId}
                    onClick={() => handleSelect(chat)}
                    style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#555555",
                    }}
                >
                    <img className={styles.avatarImg}
                        src=
                        {
                            chat.user.blocked.includes(currentUser.id)
                                ? "./avatar.png"
                                : chat.user.avatar || "./avatar.png"
                        }
                        alt='' />
                    <div className={styles.texts}>
                        <span className={styles.span}>
                            {chat.user.blocked.includes(currentUser.id)
                                ? "User"
                                : chat.user.username}
                        </span>
                        <p className={styles.p}>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addMode && <AddUser />}
        </div>
    )
}

export default ChatList