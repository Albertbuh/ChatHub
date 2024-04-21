"use client"

import styles from './chatList.module.css'

import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';

const ChatList = () => {
    const avatarPath = './avatars/Hayasaka.jpg';
    const [addMode, setAddMode] = useState(false);

    return (
        <div className={styles.chatList}>
            <div className={styles.search}>
                <div className={styles.searchBar}>
                    <IoIosSearch className={styles.img} />
                    <input className={styles.input} type='text' placeholder='Search' />
                </div>
                {addMode ? (
                    <FaMinus className={`${styles.minus} ${styles.add}`}
                        onClick={() => setAddMode((prev) => !prev)} />
                ) : (
                    <FaPlus className={styles.add}
                        onClick={() => setAddMode((prev) => !prev)} />
                )}
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
            <div className={styles.item}>
                <img className={styles.avatarImg} src={avatarPath} alt='' />
                <div className={styles.texts}>
                    <span className={styles.span}>Ai Hayasaka</span>
                    <p className={styles.p}>Last message</p>
                </div>
            </div>
        </div>
    )
}

export default ChatList