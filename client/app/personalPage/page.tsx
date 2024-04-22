"use client"

import { useContext, useEffect } from "react";

import styles from './personalPage.module.css'
import { onAuthStateChanged } from "firebase/auth";
import { ExpandContext } from "../components/navbar/expandContxt";
import { auth } from "../realTimeChat/lib/firebase";
import { useChatStore } from "../realTimeChat/lib/chatStore";
import { useUserStore } from "../realTimeChat/lib/userStore";
import LoginPage from "../realTimeChat/authorization/login/page";
import Detail from "./detail/detail";


const user = false

export default function personalPage() {
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
            <Detail/>
          </>
        ) : (
          <LoginPage />
        )
      }

    </div>
  );
}

