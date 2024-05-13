import { SendRequestData } from "@/app/models/sendRequest";
import { useState } from "react";
import { CiCamera, CiImageOn, CiMicrophoneOn } from "react-icons/ci";

import styles from "./messageSender.module.css";
import { BsEmojiNeutral } from "react-icons/bs";

interface MessageSenderProps {
    onSubmit: (data: SendRequestData) => void;
}

export default function MessageSender({ onSubmit }: MessageSenderProps) {
    const [message, setMessage] = useState("");
    const [media, setMedia] = useState("");
    const [isMediaFieldVisible, setIsMediaFieldVisible] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit({ message, mediaFilepath: media });
        setMessage("");
        setMedia("");
    };

    function handleImageClick() {
        setIsMediaFieldVisible(!isMediaFieldVisible);
    }

    return (
        <>
            <form action="" className={styles.bottom} onSubmit={handleSubmit}>
                <div className={styles.icons}>
                    <CiImageOn className={styles.imgI} onClick={handleImageClick} />
                    <CiCamera className={styles.imgI} />
                    <CiMicrophoneOn className={styles.imgI} />
                </div>
                <input
                    className={styles.input}
                    value={message}
                    type="text"
                    placeholder="Type a message..."
                    onChange={(e) => setMessage(e.target.value)}
                />
                <div className={styles.emoji}>
                    <BsEmojiNeutral className={styles.imgI} />
                </div>
                <button
                    type="submit"
                    className={styles.sendButton}
                >
                    Send
                </button>
            </form>
            <div
                className={styles.mediaField}
                style={{ opacity: isMediaFieldVisible ? "100" : "0" }}
            >
                <input
                    className={styles.input}
                    name="media"
                    value={media}
                    type="text"
                    placeholder="path to media..."
                    onChange={(e) => setMedia(e.target.value)}
                />
                <button
                    onClick={() => {
                        setIsMediaFieldVisible(false);
                    }}
                >
                    Ok
                </button>
                <button
                    onClick={() => {
                        setIsMediaFieldVisible(false);
                        setMedia("");
                    }}
                >
                    Cancel
                </button>
            </div>
        </>
    );
}
