import styles from './userInfo.module.css'

import { IoIosMore } from "react-icons/io";
import { CiVideoOn, CiEdit } from "react-icons/ci";
import { IPeerInfoVK } from '../../dto/IPeerInfo';

interface IUserProps {
   user: IPeerInfoVK
}

const UserInfo = () => {
    const url = localStorage.getItem("vk_photoUrl") ? localStorage.getItem("vk_photoUrl") : null;
    return (
        <div className={styles.userInfo}>
            <div className={styles.user}>
                <img className={styles.img} src={url!} alt='' />
                <h2>{localStorage.getItem("vk_username")}</h2>
            </div>
            <div className={styles.icons}>
                <IoIosMore className={styles.imgI}/>
                <CiVideoOn className={styles.imgI}/>
                <CiEdit className={styles.imgI}/>
            </div>
        </div>
    )
}

export default UserInfo
