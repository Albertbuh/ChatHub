import styles from './chatList.module.css'

import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";

const ChatList = () => {
    return (
        <div className={styles.chatList}>
            <div className={styles.search}>
                <div className={styles.searchBar}>
                    <IoIosSearch className={styles.img}/>
                    <input className={styles.input} type='text' placeholder='Search' />
                </div>
            <FaPlus className={styles.add}/>
            </div>
        </div>
    )
}

export default ChatList