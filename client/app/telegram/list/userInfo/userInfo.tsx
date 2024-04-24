import styles from './userInfo.module.css'

import { IoIosMore } from "react-icons/io";
import { CiVideoOn, CiEdit } from "react-icons/ci";

const UserInfo = () => {
    const avatarPath = `/assets/telegram/userAssets/${localStorage.getItem('telegram_tag')}/${localStorage.getItem('telegram_id')}/profile.jpeg`;

    return (
        <div className={styles.userInfo}>
            <div className={styles.user}>
                <img className={styles.img} src={avatarPath} alt='' />
                <h2>{localStorage.getItem("telegram_username")}</h2>
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
