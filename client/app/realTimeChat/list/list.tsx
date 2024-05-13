import UserInfo from '@/app/components/userInfo/userInfo'
import ChatList from './chatList/chatList'
import styles from './list.module.css'
import { useUserStore } from '../lib/userStore';


const List = () => {
    const avatarPath = './avatars/Hayasaka.jpg';
    const { currentUser } = useUserStore();

    return (
        <div className={styles.list}>
            <UserInfo
                avatarPath={currentUser.avatar || avatarPath}
                username={currentUser.username}
            />
            <ChatList />
        </div>
    )
}

export default List
