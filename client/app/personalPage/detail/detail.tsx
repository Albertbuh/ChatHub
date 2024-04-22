import styles from './detail.module.css'

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import { useUserStore } from '@/app/realTimeChat/lib/userStore';


const imagePaths = ['/backgrounds/1.jpg', '/backgrounds/2.jpg',
    '/backgrounds/3.jpg', '/backgrounds/4.jpg', '/backgrounds/5.jpg'
];

const Detail = () => {
    const avatarPath = './avatars/Hayasaka.jpg';

    const { currentUser } = useUserStore();


    const handleBlock = async () => {

    };

    return (
        <div className={styles.detail}>
            <div className={styles.user}>
                <img className={styles.avatarImg} src={currentUser.avatar || avatarPath} alt='' />
                <h2> {currentUser.username}</h2>
                <p className={styles.p}>Thank you for using our app</p>
            </div>
            <div className={styles.info}>
                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Chat settings</span>
                        <IoIosArrowUp className={styles.imgI} />
                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Privacy & help</span>
                        <IoIosArrowUp className={styles.imgI} />
                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Background photos</span>
                        <IoIosArrowDown className={styles.imgI} />
                    </div>
                    <div className={styles.photos}>
                        {imagePaths.map((photo, index) => (
                            <div key={index} className={styles.photoItem}>
                                <div className={styles.photoDetail}>
                                    <img className={styles.img} src={photo} alt={`Background:${index + 1}`} />
                                    <span className={styles.span}>{`Background: ${index + 1}`}</span>
                                </div>
                                <GoDownload className={styles.icon} />
                            </div>
                        ))}

                    </div>
                </div>

                <button onClick={handleBlock} className={styles.button}>Logout All</button>
            </div>
        </div>
    )
}

export default Detail