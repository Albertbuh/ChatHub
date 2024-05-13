"use client";

import { useContext, useEffect } from "react";
import LoginPage from "./authorization/login/page";
import Chat from "./chat/chat";
import Detail from "./detail/detail";
import { useUserStore } from "./lib/userStore";
import List from "./list/list";

import styles from "./realTimeChat.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useChatStore } from "./lib/chatStore";
import { ExpandContext } from "../components/navbar/expandContxt";
import Stub from "./stub/page";

export default function RealTimeChat() {
    const { isExpanded } = useContext(ExpandContext);

    const { currentUser, isLoading, fetchUserInfo } = useUserStore();
    const { chatId } = useChatStore();

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid!);
        });

        return () => {
            unSub();
        };
    }, [fetchUserInfo]);

    if (isLoading) {
        return (
            <div className={`${styles.loading} ${styles.container}`}>Loading...</div>
        );
    }

    return (
        <div
            className={currentUser ? styles.container : ""}
            style={{ marginLeft: isExpanded ? "15%" : "4%" }}
        >
            {currentUser
                ? (
                    <>
                        <List />
                        {chatId
                            ? (
                                <>
                                    <Chat />
                                    <Detail />
                                </>
                            )
                            : <Stub />}
                    </>
                )
                : <LoginPage />}
        </div>
    );
}
