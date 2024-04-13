'use client'

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import styles from './navbar.module.css';
import { AiOutlineMenu, AiOutlineHome } from "react-icons/ai";
import { SlSocialVkontakte } from "react-icons/sl";
import { LiaTelegram } from "react-icons/lia";


interface SideNavProps {
    // width: string;
    router: any;
}

// TODO: Time dependent drop-down
export default function SideNav() {
    const [sidebarActive, setSidebarActive] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const toggleBtn = document.querySelector('.toggleBtn');

        const handleClick = () => {
            setSidebarActive(!sidebarActive);
        };

        if (toggleBtn) {
            toggleBtn.addEventListener('click', handleClick);
        }

        return () => {
            if (toggleBtn) {
                toggleBtn.removeEventListener('click', handleClick);
            }
        };
    }, [sidebarActive]);

    const getActiveClass = (path: string) => {
        return pathname === path ? styles.listItemActive : '';
    };

    return (
        <nav className={`${styles.sidebar} ${sidebarActive ? styles.active : ''}`}>
            <div className={styles.logoMenu}>
                <h2 className={styles.logo}> ChatHUB</h2>
                <AiOutlineMenu className={`${styles.menuToggleBtn} toggleBtn`} />
            </div>
            <ul className={styles.list}>

                <li className={`${styles.listItem} ${getActiveClass('/')}`}>
                    <Link href="/">
                        <AiOutlineHome className={styles.listItemIcon} />
                        <span className={styles.linkName}> Home</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/telegram')}`}>
                    <Link href="/telegram">
                        <LiaTelegram className={styles.listItemIcon} />
                        <span className={styles.linkName}> Telegram</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/telegram/authorization/login')}`}>
                    <Link href="/telegram/authorization/login">
                        <LiaTelegram className={styles.listItemIcon} />
                        <span className={styles.linkName}>Telegram Login</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/telegram/authorization/verification')}`}>
                    <Link href="/telegram/authorization/verification">
                        <LiaTelegram className={styles.listItemIcon} />
                        <span className={styles.linkName}>Telegram Verification</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/telegram/authorization/password')}`}>
                    <Link href="/telegram/authorization/password">
                        <LiaTelegram className={styles.listItemIcon} />
                        <span className={styles.linkName}>Telegram Password</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/vkontakte')}`}>
                    <Link href="/vkontakte">
                        <SlSocialVkontakte className={styles.listItemIcon} />
                        <span className={styles.linkName}>VK</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/vkontakte')}`}>
                    <Link href="/vkontakte">
                        <SlSocialVkontakte className={styles.listItemIcon} />
                        <span className={styles.linkName}>VK Login</span>
                    </Link>
                </li>

                <li className={`${styles.listItem} ${getActiveClass('/vkontakte')}`}>
                    <Link href="/vkontakte">
                        <SlSocialVkontakte className={styles.listItemIcon} />
                        <span className={styles.linkName}>VK Verification</span>
                    </Link>

                </li>
            </ul>
        </nav>

    );

};
