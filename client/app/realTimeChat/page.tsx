"use client"

import { useEffect } from "react";
import LoginPage from "./authorization/login/page";
import Chat from "./chat/chat";
import Detail from "./detail/detail";
import { useUserStore } from "./lib/userStore";
import List from "./list/list";
import Notification from "./notification/notification";

import styles from './realTimeChat.module.css'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { navigate } from "./authorization/login/actions";
import { useChatStore } from "./lib/chatStore";

const user = false

export default function RealTimeChat() {
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


  return (
    <div className={currentUser ? styles.container : ''}>
      {
        currentUser ? (
          <>
        <List/>
        {chatId && <Chat/>}
        {chatId && <Detail/>}
          </>
        ) : (
          <LoginPage/>
        )
      }

    </div>
  );
}
