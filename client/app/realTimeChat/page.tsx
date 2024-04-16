import Chat from "./chat/chat";
import Detail from "./detail/detail";
import List from "./list/list";

import styles from './realTimeChat.module.css'


export default function RealTimeChat() {
  return (
    <div className={styles.container}>
        <List/>
        <Chat/>
        <Detail/>
    </div>
  );
}
