"use client";

import styles from "./chatList.module.css";

import { IoIosSearch } from "react-icons/io";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useState } from "react";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import Image from "next/image";
import { IDialogInfoVK } from "../../dto/IDialogInfo";
import Timestamp from "@/app/components/timestamp/timestamp";

interface IChatProps {
    dialogs: IDialogInfoVK[];
    handleClick: (id: number) => void;
}


const ChatList = ({ dialogs, handleClick }: IChatProps) => {
    const [searchFilter, setSearchFilter] = useState("");

    function handleSearchBarUpdate(filter: string) {
        setSearchFilter(filter.toLowerCase());
        console.log(searchFilter);
    }
    console.log(dialogs);
    return (
        <div className={styles.chatList}>
            <SearchBar onUpdate={handleSearchBarUpdate} />
            <ul style={{width:"100%"}}>
                {dialogs.filter((dialog) =>
                    dialog.mainUsername?.toLowerCase().includes(searchFilter) ||
                    dialog.title?.toLowerCase().includes(searchFilter)
                ).map((dialog) => (
                    <li
                        key={dialog.id}
                        className={styles.item}
                        onClick={() => handleClick(dialog.id)}
                    >
                        <Image
                            className={styles.avatarImg}
                            src={dialog.photoUri}
                            width={"50"}
                            height={"50"}
                            alt={""}
                        />
                        <div className={styles.texts}>
                            <span className={styles.title}>{dialog.title}</span>
                            <p className={styles.p}>
                                <span className={styles.sendername}>
                                    {dialog.topMessage.sender.username}: 
                                </span>&nbsp;
                                {dialog.topMessage.message}
                            </p>
                            <Timestamp time={dialog.topMessage.date} className={styles.time}/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

interface SearchBarProps {
    onUpdate: (filter: string) => void;
}
function SearchBar({ onUpdate }: SearchBarProps) {
    const [addMode, setAddMode] = useState(false);

    return (
        <div className={styles.search}>
            <div className={styles.searchBar}>
                <IoIosSearch className={styles.img} />
                <input
                    onChange={(e) => onUpdate(e.target.value)}
                    className={styles.input}
                    type="text"
                    placeholder="Search"
                />
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
