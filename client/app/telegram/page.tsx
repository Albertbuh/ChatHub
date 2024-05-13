"use client";
import React, { useContext, useEffect, useState } from "react";
import { GetDialogs, GetMessages, sendMessage } from "../utils/getRequests";
import Connector from "../utils/singnalR-connector";
import { IDialogInfo } from "../models/dto/IDialogInfo";
import { ConnectorEntity } from "../models/connectorEntity";

import styles from "./telegram.module.css";
import Chat from "./chat/chat";
import { IMessageInfo } from "../models/dto/IMessageInfo";
import { ExpandContext } from "../components/navbar/expandContxt";
import { SendRequest } from "../models/sendRequest";
import { GetPathToProfilePhotoById } from "../utils/filePaths";
import UserInfo from "../components/userInfo/userInfo";
import ChatList from "./chatList/chatList";

export default function Home() {
    const [dialogsUpdate, setDialogsUpdate] = useState<IDialogInfo[]>([]);
    const [messages, setMessages] = useState<IMessageInfo[]>([]);
    const [currentDialogId, setCurrentDialogId] = useState(0);
    const { isExpanded } = useContext(ExpandContext);

    const handleDialogsUpdate = (connectorEntity: ConnectorEntity) => {
        setDialogsUpdate(connectorEntity.data as IDialogInfo[]);
    };

    const handleMessagesUpdate = (connectorEntity: ConnectorEntity) => {
        if (connectorEntity.id == currentDialogId) {
            let newMessages = connectorEntity.data as IMessageInfo[];
            setMessages(newMessages);
        }
    };

    useEffect(() => {
        const connector = new Connector("telegram");
        connector.setOnDialogsUpdateCallback(handleDialogsUpdate);
        connector.setOnMessagesUpdateCallback(handleMessagesUpdate);
        return () => {
            connector?.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedDialogs = await GetDialogs("telegram");
                if (updatedDialogs) {
                    setDialogsUpdate(updatedDialogs);
                }
            } catch (error) {
                console.error("Ошибка при получении диалогов:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const UpdateMessages = async () => {
            if (currentDialogId == 0) {
                return;
            }

            const newMessages = await GetMessages(currentDialogId, 0, 50);
            setMessages(newMessages);
        };

        UpdateMessages();
    }, [currentDialogId]);

    function handleListClick(id: number) {
        setCurrentDialogId(id);
        setMessages([]);
    }

    const handleSendSubmit = async (data: SendRequest) => {
        var sendedMessage = await sendMessage("telegram", currentDialogId, data);
        if (sendedMessage) {
            setMessages([sendedMessage, ...messages]);
        }
    };

    if (dialogsUpdate && dialogsUpdate.length > 0) {
        return (
            <div
                className={styles.container}
                style={{ marginLeft: isExpanded ? "15%" : "4%" }}
            >
                <div className={styles.list}>
                    <UserInfo
                        avatarPath={localStorage.getItem("telegram_photoUrl") ?? ""}
                        username={localStorage.getItem("telegram_username")}
                    />
                    <ChatList
                        dialogs={dialogsUpdate}
                        handleClick={handleListClick}
                        dialogPhotoHandler={(id: number | string) =>
                            GetPathToProfilePhotoById(id, "telegram_tag")}
                    />
                </div>
                <Chat
                    messages={messages.toReversed()}
                    currentDialog={dialogsUpdate.find((d) => d.id == currentDialogId)}
                    onSendSubmit={handleSendSubmit}
                />
            </div>
        );
    } else {
        return <h1>Loading...</h1>;
    }
}
