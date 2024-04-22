"use client"

import { useContext, useEffect } from "react";
import LoginPage from "./authorization/login/page";
import Chat from "./chat/chat";
import Detail from "./detail/detail";
import { useUserStore } from "./lib/userStore";
import List from "./list/list";

import styles from './realTimeChat.module.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useChatStore } from "./lib/chatStore";
import { ExpandContext } from "../components/navbar/expandContxt";


const user = false

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

  if (isLoading) return <div className={`${styles.loading} ${styles.container}`}>Loading...</div>;


  const containerStyles = {
    marginLeft: isExpanded ? '15%' : '4%',
  };

  console.log("navbar expanded in RealTimeChat", isExpanded)
  return (
    <div className={currentUser ? styles.container : ''} style={containerStyles}>
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (
          <LoginPage />
        )
      }

    </div>
  );
}

