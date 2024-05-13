"use client";
import React, { Suspense, useContext, useEffect, useState } from "react";
import { GetDialogsVK, GetMessagesVK } from "../utils/serverRequests";
import Connector from "../utils/singnalR-connector";
import { ConnectorEntity } from "../models/connectorEntity";

import styles from "./vk.module.css";
import Chat from "./chat/chat";
import { IDialogInfoVK } from "./dto/IDialogInfo";
import { IMessageInfoVK } from "./dto/IMessageInfo";
import MessengerResponse from "../models/dto/TLResponse";
import { SendRequestData } from "../models/sendRequestData";
import UserInfo from "../components/userInfo/userInfo";
import ChatList from "./chatList/chatList";
import { ExpandContext } from "../components/navbar/expandContxt";

export default function Home() {
    const [dialogsUpdate, setDialogsUpdate] = useState<IDialogInfoVK[]>([]);
    const [messages, setMessages] = useState<IMessageInfoVK[]>([]);
    const [currentDialogId, setCurrentDialogId] = useState(0);

    const { isExpanded } = useContext(ExpandContext);
    const avatarPath = localStorage.getItem("vkontakte_photoUrl") ?? "";

    const handleDialogsUpdate = (connectorEntity: ConnectorEntity) => {
        setDialogsUpdate(connectorEntity.data as IDialogInfoVK[]);
        console.log("dialogs");
    };

    const handleMessagesUpdate = (connectorEntity: ConnectorEntity) => {
        if (connectorEntity.id == currentDialogId) {
            let newMessages = connectorEntity.data as IMessageInfoVK[];
            console.log(newMessages);
            console.log("messages");
            setMessages(newMessages);
        }
    };

    useEffect(() => {
        const connector = new Connector("vkontakte");
        connector.setOnDialogsUpdateCallback(handleDialogsUpdate);
        connector.setOnMessagesUpdateCallback(handleMessagesUpdate);

        return () => {
            connector?.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedDialogs = await GetDialogsVK(0, 100);
                setDialogsUpdate(updatedDialogs);
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
            console.log(currentDialogId);
            const newMessages = await GetMessagesVK(currentDialogId, 0, 50);
            // const newMessages = await GetDialogsVK(0,100);
            console.log(newMessages);

            setMessages(newMessages);
        };

        UpdateMessages();
    }, [currentDialogId]);

    function handleListClick(id: number) {
        setCurrentDialogId(id);
        setMessages([]);
    }

    const handleSendSubmit = async (data: SendRequestData) => {
        var response = await fetch(
            `http://localhost:5041/api/v1.0/vk/peers/${currentDialogId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
        if (response.ok) {
            let message: MessengerResponse = await response.json();
            let sendedMessage = message.data as IMessageInfoVK;
            if (data) {
                setMessages([sendedMessage, ...messages]);
            }
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
                        avatarPath={avatarPath}
                        username={localStorage.getItem("vkontakte_username")}
                    />
                    <ChatList dialogs={dialogsUpdate} handleClick={handleListClick} />
                </div>
                <Chat
                    messages={messages}
                    currentDialog={dialogsUpdate.find((d) => d.id == currentDialogId)}
                    onSendSubmit={handleSendSubmit}
                />
            </div>
        );
    }
}
