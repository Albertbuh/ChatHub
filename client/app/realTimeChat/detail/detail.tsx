import styles from './detail.module.css'

import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { GoDownload } from "react-icons/go";
import { useChatStore } from '../lib/chatStore';
import { useUserStore } from '../lib/userStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Detail = () => {
    const avatarPath = './avatars/Hayasaka.jpg';

    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock, resetChat } =
        useChatStore();
    const { currentUser } = useUserStore();

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock();
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className={styles.detail}>
            <div className={styles.user}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <h2> Hayasaka Ai</h2>
                <p className={styles.p}>She is just the best girl</p>
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
                        <span className={styles.span}>Shared photos</span>
                        <IoIosArrowDown className={styles.imgI} />
                    </div>
                    <div className={styles.photos}>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img>
                                <span className={styles.span}> photo_MC_2023.png</span>
                            </div>
                            <GoDownload className={styles.icon} />
                        </div>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img>
                                <span className={styles.span}> photo_MC_2023.png</span>
                            </div>
                            <GoDownload className={styles.icon} />
                        </div>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img>
                                <span className={styles.span}> photo_MC_2023.png</span>
                            </div>
                            <GoDownload className={styles.icon} />
                        </div>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img>
                                <span className={styles.span}> photo_MC_2023.png</span>
                            </div>
                            <GoDownload className={styles.icon} />
                        </div>
                        <div className={styles.photoItem}>
                            <div className={styles.photoDetail}>
                                <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img>
                                <span className={styles.span}> photo_MC_2023.png</span>
                            </div>
                            <GoDownload className={styles.icon} />
                        </div>

                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Shared files</span>
                        <IoIosArrowUp className={styles.imgI} />
                    </div>
                </div>
                <button onClick={handleBlock} className={styles.button}>{isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User blocked"
            : "Block User"}</button>
            </div>
        </div>
    )
}

export default Detail