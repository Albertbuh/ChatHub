import { IDialogInfo } from '@/app/models/dto/IDialogInfo';
import ChatList from './chatList/chatList'
import styles from './list.module.css'
import UserInfo from './userInfo/userInfo'
import { IDialogInfoVK } from '../dto/IDialogInfo';

interface IListProps {
    dialogs: IDialogInfoVK[];
    handleClick: (id:number) => void;
}

const List = ({dialogs, handleClick}: IListProps) =>{
    return(
        <div className={styles.list}>
            <UserInfo/>
            <ChatList dialogs={dialogs} handleClick={handleClick}/>
        </div>
    )
}

export default List
