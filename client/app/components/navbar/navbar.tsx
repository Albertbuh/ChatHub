"use client";

import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import styles from "./navbar.module.css";
import { AiOutlineHome, AiOutlineMenu } from "react-icons/ai";
import { SlSocialVkontakte } from "react-icons/sl";
import { LiaTelegram } from "react-icons/lia";
import { BsChatSquareHeart } from "react-icons/bs";
import { CiLogout } from "react-icons/ci";
import { auth } from "@/app/realTimeChat/lib/firebase";
import { useUserStore } from "@/app/realTimeChat/lib/userStore";
import { ExpandContext } from "./expandContxt";

// TODO: Time dependent drop-down
export default function SideNav() {
    const { isExpanded, setIsExpanded } = useContext(ExpandContext);

    const avatarPath = "/avatars/Hayasaka.jpg";
    const { currentUser } = useUserStore();

    let container: HTMLElement | null = null;
    if (typeof window !== "undefined") {
        container = document.getElementById("container");
    }
    const [sidebarActive, setSidebarActive] = useState(false);

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

    return (
        <nav className={`${styles.sidebar} ${sidebarActive ? styles.active : ""}`}>
            <div className={styles.logoMenu}>
                <h2 className={styles.logo}>ChatHUB</h2>
                <AiOutlineMenu className={`${styles.menuToggleBtn} toggleBtn`} />
            </div>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <Link href="/personalPage">
                        <AiOutlineHome className={styles.listItemIcon} />
                        <span className={styles.linkName}>Home</span>
                    </Link>
                </li>

                <li className={styles.listItem}>
                    <Link href="/telegram">
                        <LiaTelegram className={styles.listItemIcon} />
                        <span className={styles.linkName}>Telegram</span>
                    </Link>
                </li>

                <li className={styles.listItem}>
                        <Link href="/vkontakte">
                            <SlSocialVkontakte className={styles.listItemIcon} />
                            <span className={styles.linkName}>VK</span>
                        </Link>
                </li>

                <li className={styles.listItem}>
                    <Link href="/realTimeChat">
                        <BsChatSquareHeart className={styles.listItemIcon} />
                        <span className={styles.linkName}>Real Time Chat</span>
                    </Link>
                </li>
            </ul>
            <ul className={`${styles.list} ${styles.flexColumn}`}>
                <li
                    className={styles.listItem}
                    onClick={() =>
                        auth.signOut()}
                >
                    <Link href="/realTimeChat">
                        <CiLogout className={styles.listItemIcon} />
                        <span className={styles.linkName}>Logout</span>
                    </Link>
                </li>
                <li className={`${styles.listItem} `}>
                    <Link href="/personalPage">
                        <img
                            className={styles.avatarImg}
                            src={currentUser?.avatar || avatarPath}
                            alt=""
                        />
                        <span className={styles.linkName}>Your Name</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}
