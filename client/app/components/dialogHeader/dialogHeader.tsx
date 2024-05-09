import { useEffect, useState } from "react";
import Image from "next/image";
import { CiCircleInfo, CiPhone, CiVideoOn } from "react-icons/ci";

import styles from "./dialogHeader.module.css";

interface TopProps {
    title: string;
    pathToPhoto: string;
}

export default function DialogHeader(props: TopProps | undefined) {
    if (!props) {
        return null;
    }

    const [profilePath, setProfilePath] = useState(
        props.pathToPhoto,
    );
    useEffect(() => {
        setProfilePath(props.pathToPhoto);
    }, [props]);

    return (
        <div className={styles.top}>
            <div className={styles.user}>
                <Image
                    src={profilePath}
                    width={"60"}
                    height={"60"}
                    alt=""
                    className={styles.avatarImg}
                    onError={() => setProfilePath("/avatars/defaultProfile.jpeg")}
                />
                <div className={styles.texts}>
                    <span className={styles.span}>{props.title}</span>
                    <p className={styles.p}>
                        Have a good day, you better than you think!
                    </p>
                </div>
            </div>
            <div className={styles.icons}>
                <CiPhone className={styles.imgI} />
                <CiVideoOn className={styles.imgI} />
                <CiCircleInfo className={styles.imgI} />
            </div>
        </div>
    );
}
