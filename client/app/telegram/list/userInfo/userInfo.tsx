import styles from './userInfo.module.css'

import { IoIosMore } from "react-icons/io";
import { CiVideoOn, CiEdit } from "react-icons/ci";

const UserInfo = () => {
    const avatarPath = `/assets/telegram/userAssets/${localStorage.getItem('tag')}/${localStorage.getItem('id')}/profile.jpeg`;

    return (
        <div className={styles.userInfo}>
            <div className={styles.user}>
                <img className={styles.img} src={avatarPath} alt='' />
                <h2>{localStorage.getItem("username")}</h2>
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
