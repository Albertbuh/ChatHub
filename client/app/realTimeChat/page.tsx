import LoginPage from "./authorization/login/page";
import Chat from "./chat/chat";
import Detail from "./detail/detail";
import List from "./list/list";

import styles from './realTimeChat.module.css'

const user = true

export default function RealTimeChat() {
  return (
    <div className={styles.container}>
      {
        user ? (
          <>
        <List/>
        <Chat/>
        <Detail/>
          </>
        ) : (
          <LoginPage/>
        )
      }

    </div>
  );
}
