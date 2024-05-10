import { CiCircleInfo, CiPhone, CiVideoOn } from "react-icons/ci";

import styles from "./dialogHeader.module.css";
import ProfilePhoto from "../profilePhoto/profilePhoto";

interface TopProps {
    title: string;
    pathToPhoto: string;
}

export default function DialogHeader(props: TopProps) {
    return (
        <div className={styles.top}>
            <div className={styles.user}>
                <ProfilePhoto 
                    src={props.pathToPhoto}
                    width={"60"}
                    height={"60"}
                    alt=""
                    className={styles.avatarImg}
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
