"use client";
import React, { Suspense, useEffect, useState } from "react";
import { GetDialogs, GetMessages } from "../utils/getRequests";
import Connector from "../utils/singnalR-connector";
import { IDialogInfo } from "../models/dto/IDialogInfo";
import { ConnectorEntity } from "../models/connectorEntity";
import List from "./list/list";

import styles from "./telegram.module.css";
import Chat from "./chat/chat";
import { IMessageInfo } from "../models/dto/IMessageInfo";

export default function Home() {
    const [dialogsUpdate, setDialogsUpdate] = useState<IDialogInfo[]>([]);
    const [messages, setMessages] = useState<IMessageInfo[]>([]);
    const [currentDialogId, setCurrentDialogId] = useState(0);

    const handleDialogsUpdate = (connectorEntity: ConnectorEntity) => {
        setDialogsUpdate(connectorEntity.data as IDialogInfo[]);
    };

    const handleMessagesUpdate = (connectorEntity: ConnectorEntity) => {
        if (connectorEntity.id == currentDialogId) {
            let newMessage = connectorEntity.data as IMessageInfo[];
            if(!messages.find(m => m.id === newMessage[0].id))
                setMessages([newMessage[0], ...messages]);
        }
    };

    const connectorInstance = Connector();
    connectorInstance.setOnDialogsTLUpdateCallback(handleDialogsUpdate);
    connectorInstance.setOnMessagesTLUpdateCallback(handleMessagesUpdate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedDialogs = await GetDialogs();
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

            const newMessages = await GetMessages(currentDialogId, 0, 50);
            setMessages(newMessages);
        };

        UpdateMessages();
    }, [currentDialogId]);

    function handleListClick(id: number) {
        setCurrentDialogId(id);
    }

    const handleSendSubmit = async (data: SendData) => {
        await fetch(
            `http://localhost:5041/api/v1.0/telegram/peers/${currentDialogId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
    };

    if (dialogsUpdate && dialogsUpdate.length > 0) {
        return (
            <div className={styles.container}>
                <List dialogs={dialogsUpdate} handleClick={handleListClick} />
                <Chat
                    messages={messages}
                    currentDialog={dialogsUpdate.find((d) => d.id == currentDialogId)}
                    onSendSubmit={handleSendSubmit}
                />
            </div>
        );
    }
}

export interface SendData {
    message: string;
    mediaFilepath: string;
}
