"use client";

import styles from "./chatList.module.css";

import { useState } from "react";
import { IDialogInfoVK } from "../dto/IDialogInfo";
import ChatField from "@/app/components/chatField/chatField";
import SearchBar from "@/app/components/searchBar/searchBar";

interface IChatProps {
    dialogs: IDialogInfoVK[];
    handleClick: (id: number) => void;
}


const ChatList = ({ dialogs, handleClick }: IChatProps) => {
    const [searchFilter, setSearchFilter] = useState("");

    function handleSearchBarUpdate(filter: string) {
        setSearchFilter(filter.toLowerCase());
    }
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
                        onClick={() => handleClick(dialog.id)}
                    >
                        <ChatField
                            title={dialog.title}
                            pathToPhoto={dialog.photoUrl}
                            sender={dialog.topMessage.sender.username}
                            message={dialog.topMessage.message}
                            date={dialog.topMessage.date}/>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;
