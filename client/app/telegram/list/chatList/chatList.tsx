"use client";

import styles from "./chatList.module.css";

import { IoIosSearch } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import Image from "next/image";

interface IChatProps {
    dialogs: IDialogInfo[];
    handleClick: (id:number) => void;
}

const ChatList = ({ dialogs, handleClick }: IChatProps) => {

    return (
        <div className={styles.chatList}>
            <SearchBar/>
            <ul>
            {dialogs.map((dialog) => (
                <li
                    key={dialog.id}
                    className={styles.item}
                    onClick={() => handleClick(dialog.id)}
                >
                    <Image
                        className={styles.avatarImg}
                        src={`/assets/telegram/userAssets/${localStorage.getItem('tag')}/${dialog.id}/profile.jpeg`}
                        width={"50"}
                        height={"50"}
                        alt={"aboba"}
                    />
                    <div className={styles.texts}>
                        <span className={styles.span}>{dialog.title}</span>
                        <p className={styles.p}>{dialog.topMessage.message}</p>
                    </div>
                </li>
            ))}
        </ul>
        </div>
    );
};

function SearchBar() {
    const [addMode, setAddMode] = useState(false);
    return (
        <div className={styles.search}>
            <div className={styles.searchBar}>
                <IoIosSearch className={styles.img} />
                <input className={styles.input} type="text" placeholder="Search" />
            </div>
            {addMode
                ? (
                    <FaMinus
                        className={`${styles.minus} ${styles.add}`}
                        onClick={() => setAddMode((prev) => !prev)}
                    />
                )
                : (
                    <FaPlus
                        className={styles.add}
                        onClick={() => setAddMode((prev) => !prev)}
                    />
                )}
        </div>
    );
}


export default ChatList;
