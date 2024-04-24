import styles from './detail.module.css'

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import { useUserStore } from '@/app/realTimeChat/lib/userStore';
import { useContext, useState } from 'react';
import BackgroundContext from '@/app/BackGroundContext';
import { logoutRequest } from '@/app/utils/getRequests';
import { navigate } from '@/app/realTimeChat/authorization/login/actions';
import { redirect } from 'next/dist/server/api-utils';


const imagePaths = ['/backgrounds/1.jpg', '/backgrounds/2.jpg',
    '/backgrounds/3.jpg', '/backgrounds/4.jpg', '/backgrounds/5.jpg'
];


interface DetailProps {
    backgroundImage: string;
    setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
}

const Detail = () => {
    const avatarPath = './avatars/Hayasaka.jpg';

    const { currentUser } = useUserStore();
    const { updateBackground } = useContext(BackgroundContext);

    const handleLogout = async () => {
        localStorage.clear();
        await logoutRequest("telegram");
        await logoutRequest("vk");
    };

    const handleDownloadClick = (imageNumber: number) => {
        const newBg = imagePaths[imageNumber - 1];
        updateBackground(newBg);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
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

                <div className={`${styles.option} ${isOpen ? styles.open : ''}`}>
                    <div className={styles.title} onClick={toggleDropdown}>
                        <span className={styles.span}>Background photos</span>
                        {isOpen ? <IoIosArrowUp className={styles.imgI} /> : <IoIosArrowDown className={styles.imgI} />}
                    </div>
                    <div className={styles.photos}>
                        {imagePaths.map((photo, index) => (
                            <div key={index} className={styles.photoItem}>
                                <div className={styles.photoDetail}>
                                    <img className={styles.img} src={photo} alt={`photo_${index + 1}`} />
                                    <span className={styles.span}>{`photo_${index + 1}.jpg`}</span>
                                </div>
                                <GoDownload className={styles.icon} onClick={() => handleDownloadClick(index + 1)} />
                            </div>
                        ))}

                    </div>
                </div>

                <button onClick={handleLogout} className={styles.button}>Logout All</button>
            </div>
        </div>
    )
}

export default Detail
