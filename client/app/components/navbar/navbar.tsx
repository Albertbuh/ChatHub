"use client";

import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";

import styles from "./navbar.module.css";
import { AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import { SlSocialVkontakte } from "react-icons/sl";
import { LiaTelegram } from "react-icons/lia";
import { BsChatSquareHeart } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { useUserStore } from "@/app/realTimeChat/lib/userStore";
import { ExpandContext } from "./expandContxt";
import ProfilePhoto from "../profilePhoto/profilePhoto";
import { logoutRequest } from "@/app/utils/serverRequests";

export default function SideNav() {
    const { isExpanded, setIsExpanded } = useContext(ExpandContext);

    const defaultAvatarPath = useRef("/avatars/Hayasaka.jpg");
    const { currentUser } = useUserStore();

    let container: HTMLElement | null = null;
    if (typeof window !== "undefined") {
        container = document.getElementById("container");
    }
    const [sidebarActive, setSidebarActive] = useState(false);
    const [currentChat, setCurrentChat] = useState(
        localStorage.getItem("current_chat") ?? "",
    );

    useEffect(() => {
        localStorage.setItem("current_chat", currentChat ?? "");
    }, [currentChat]);

    useEffect(() => {
        const toggleBtn = document.querySelector(".toggleBtn");

        const handleClick = () => {
            setSidebarActive(!sidebarActive);
            if (sidebarActive === false && container) {
                container.style.marginLeft = "10%";
            } else if (container) {
                container.style.marginLeft = "0";
            }

            setIsExpanded(!isExpanded);
            console.log("navbar expanded", isExpanded);
        };

        if (toggleBtn) {
            toggleBtn.addEventListener("click", handleClick);
        }

        return () => {
            if (toggleBtn) {
                toggleBtn.removeEventListener("click", handleClick);
            }
        };
    }, [sidebarActive]);

    function GetProfilePicture(): string {
        return localStorage.getItem(
            `${currentChat}_photoUrl`,
        ) ??
            currentUser?.avatar ??
            defaultAvatarPath.current;
    }

    return (
        <nav className={`${styles.sidebar} ${sidebarActive ? styles.active : ""}`}>
            <div className={styles.logoMenu}>
                <h2 className={styles.logo}>ChatHUB</h2>
                <AiOutlineMenu className={`${styles.menuToggleBtn} toggleBtn`} />
            </div>
            <ul className={styles.list}>
                <li className={`${styles.listItem} ${currentChat === "" ? styles.listItemActive : ""
                    }`}
                    onClick={() => setCurrentChat("")}
                >
                    <Link href="/personalPage">
                        <AiOutlineHome className={styles.listItemIcon} />
                        <span className={styles.linkName}>Home</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${currentChat === "telegram" ? styles.listItemActive : ""
                    }`}>
                    <Link
                        href="/telegram"
                        onClick={() => setCurrentChat("telegram")}
                    >
                        <LiaTelegram className={styles.listItemIcon} />
                        <span className={styles.linkName}>Telegram</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${currentChat === "vkontakte" ? styles.listItemActive : ""
                    }`}>
                    <Link
                        href="/vkontakte"
                        onClick={() => setCurrentChat("vkontakte")}
                    >
                        <SlSocialVkontakte className={styles.listItemIcon} />
                        <span className={styles.linkName}>VK</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} 
                ${currentChat === "realTimeChat" ? styles.listItemActive : ""
                    }`}
                    onClick={() => setCurrentChat("realTimeChat")}>
                    <Link href="/realTimeChat">
                        <BsChatSquareHeart
                            className={styles.listItemIcon}
                        // onClick={() => setCurrentChat("realTimeChat")}
                        />
                        <span className={styles.linkName}>Real Time Chat</span>
                    </Link>
                </li>
            </ul>
            <ul className={`${styles.list} ${styles.flexColumn}`}>
                <li className={styles.listItem}>
                    <Link
                        href="/"
                        onClick={async () => await logoutRequest(currentChat)}
                    >
                        <CiLogout className={styles.listItemIcon} />
                        <span className={styles.linkName}>Logout</span>
                    </Link>
                </li>
                <li className={`${styles.listItem} `}
                onClick={() => setCurrentChat("")}>
                    <Link href="/personalPage">
                        
                        {/* <ProfilePhoto
                            width={30}
                            height={30}
                            className={styles.avatarImg}
                            src={GetProfilePicture()}
                            alt=""
                        /> */}
                        {/* <span className={styles.linkName}>
                            {localStorage.getItem(
                                `${currentChat}_username`,
                            )} */}
                        <img
                            src={currentUser?.avatar ?? defaultAvatarPath.current}
                            alt="User Avatar"
                            className={styles.avatarImg}
                        />
                        <span className={styles.linkName}>
                            {currentUser?.username ?? "username"}
                        </span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
