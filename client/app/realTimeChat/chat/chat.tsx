"use client"

import styles from './chat.module.css'

import { CiVideoOn, CiPhone, CiCircleInfo, CiImageOn, CiCamera, CiMicrophoneOn } from "react-icons/ci";
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { BsEmojiNeutral } from "react-icons/bs";
import { useEffect, useRef, useState } from 'react';
import { db } from '../lib/firebase';
import { useUserStore } from '../lib/userStore';
import upload from '../lib/upload';
import { useChatStore } from '../lib/chatStore';
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
    const avatarPath = './avatars/Hayasaka.jpg';


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
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" })
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
   

    console.log(chat)

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
                        (c: { chatId: string }) => c.chatId === chatId
                    );

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id ? true : false;
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
                    <img className={styles.avatarImg} src={user?.avatar || avatarPath} alt='' />
                    <div className={styles.texts}>
                        <span className={styles.span}> {user?.username}</span>
                        <p className={styles.p}> She is just the best girl
                            {/* Despite being the "big sister" to Kaguya and one of the most level-headed people in the whole cast, she still has a soft, sensitive, and inexperienced side to her. I don't know how far you've read or what examples I can give without spoilers. I can reply with spoilers if you want specifics.
                            She lives a fascinating double life as a high school student yet also the top maid/personal servant of a naive rich girl. Several months ago I made a post where I described every character (with exceptions as people noted) in one sentence: for Haysasaka I wrote " It's like if Alfred Pennysworth was really Batman, and Bruce Wayne was actually a moody teenage girl with bad, not-dead parents."
                            Going off the above point, she's somewhat of a cipher: given how difficult it is to separate her real personality from her endless wardrobe of disguises and "personas", Hayasaka can essentially be anything you want. Do you think that Hayasaka is an innocent girl who just acts tough on the job? Do you believe she's a cynical stick-in-the-mud? Do you think she's sweet and kind but too tired and busy to show it? Do you think she's a naive romantic who hides her insecurity beneath toughness? You can create many different interpretations for her and find moments to support your preferred "version" of her.
                            She's smart and hardworking, without putting her intelligence into mindgames or overthinking things like Shirogane and Kaguya do.
                            She is mostly above everyone else's nonsense. She cuts through the BS rather than creating more of it.
                            Unlike Chika, she hasn't been flanderized and memed into supervillainy/ultimate waifu material (depending on your view). Hayasaka isn't totally left out of the memes and iconic moments (HEY HEY HEY and "Hayasaka lied as easily as she breathed." are my favorites), but she can mostly stand on her own as a character.
                            She suffers inconvenience and frustration from other people, setting off some people's sense of "I must protecc". She suffers the kind of pain you can sympathize with, but doesn't make you pity or coddle her. She just wants a break!
                             */}
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
                        className={message.senderId === currentUser?.id ? styles.messageOwn : styles.message}
                        key={message?.createdAt.toString()}>
                        {message.senderId !== currentUser?.id && (
                            <img
                                className={styles.avatarImg}
                                src={user?.avatar || avatarPath}
                                alt=""
                            />
                        )}
                        {/* <img className={styles.avatarImg} src={user?.avatar || avatarPath} alt='' /> */}
                        <div className={styles.texts}>
                            {message.img &&
                                <img className={styles.img}
                                    src={message.img} alt=''>
                                    {/*  src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'> */}
                                </img>}
                            {/* <p className={styles.p}> Some text from cutie</p> */}
                            <p className={`${styles.p} ${styles.textSended}`}> {message.text}</p>
                            {/* <span className={styles.span}>few seconds ago</span> */}
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
                    <label htmlFor='file'>
                        <CiImageOn className={styles.imgI} />
                    </label>
                    <input
                        type='file'
                        id='file'
                        style={{ display: "none" }}
                        onChange={handleImg} />
                    <CiCamera className={styles.imgI} />
                    <CiMicrophoneOn className={styles.imgI} />

                </div>
                <input className={styles.input} type='text'
                    placeholder={
                        isCurrentUserBlocked || isReceiverBlocked
                            ? "You cannot send a message"
                            : "Type a message..."
                    }
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
                >Send</button>
            </div>
        </div>
    )
}

export default Chat