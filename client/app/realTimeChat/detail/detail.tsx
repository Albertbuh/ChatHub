import styles from './detail.module.css'

import { IoIosArrowUp, IoIosArrowDown  } from "react-icons/io";

const Detail = () => {
    const avatarPath = './avatars/Hayasaka.jpg';

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
                        <IoIosArrowUp className={styles.imgI}/>
                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Privacy & help</span>
                        <IoIosArrowUp className={styles.imgI}/>
                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Shared photos</span>
                        <IoIosArrowDown className={styles.imgI}/>
                    </div>
                    <div className={styles.photos}>
                        <div className={styles.photoItem}>
                            {/* <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img> */}
                            <span className={styles.span}> photo_MC_2023.png</span>
                        </div>
                        {/* download */}
                    </div>
                </div>

                <div className={styles.option}>
                    <div className={styles.title}>
                        <span className={styles.span}>Shared files</span>
                        <IoIosArrowUp className={styles.imgI}/>
                    </div>
                </div>
                <button className={styles.button}>Block User</button>
            </div>
        </div>
    )
}

export default Detail