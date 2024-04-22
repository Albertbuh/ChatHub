"use client";
import React, { Suspense, useEffect, useState } from "react";
import { GetDialogsTL, GetMessagesTL } from "../utils/getRequests";
import Connector from "../utils/singnalR-connector";
import { IDialogInfo } from "./dto/IDialogInfo";
import { ConnectorEntity } from "../models/connectorEntity";
import List from "./list/list";

import styles from "./telegram.module.css";
import Chat from "./chat/chat";
import { IMessageInfo } from "./dto/IMessageInfo";
import TLResponse from "./dto/TLResponse";
const connectorInstance = Connector.getInstance();

export default function Home() {
    const [dialogsUpdate, setDialogsUpdate] = useState<IDialogInfo[]>([]);
    const [messages, setMessages] = useState<IMessageInfo[]>([]);
    const [currentDialogId, setCurrentDialogId] = useState(0);

    const handleDialogsUpdate = (connectorEntity: ConnectorEntity) => {
        setDialogsUpdate(connectorEntity.data as IDialogInfo[]);
    };

    const handleMessagesUpdate = (connectorEntity: ConnectorEntity) => {
        if (connectorEntity.id == currentDialogId) {
            let newMessages = connectorEntity.data as IMessageInfo[];
            setMessages(newMessages);
        }
    };

   
    connectorInstance.setOnDialogsTLUpdateCallback(handleDialogsUpdate);
    connectorInstance.setOnMessagesTLUpdateCallback(handleMessagesUpdate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedDialogs = await GetDialogsTL();
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

            const newMessages = await GetMessagesTL(currentDialogId, 0, 50);
            setMessages(newMessages);
        };

        UpdateMessages();
    }, [currentDialogId]);

    function handleListClick(id: number) {
        setCurrentDialogId(id);
    }

    const handleSendSubmit = async (data: SendData) => {
        var response = await fetch(
            `http://localhost:5041/api/v1.0/telegram/peers/${currentDialogId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            },
        );
        if(response.ok) {
            let message:TLResponse = await response.json();
            let sendedMessage = message.data as IMessageInfo;
            if(data)
                setMessages([sendedMessage, ...messages]);
        }
        if (data.media) {
            await fetch(
                `http://localhost:5041/api/v1.0/telegram/peers/${currentDialogId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    body: JSON.stringify(data.media),
                },
            );
        }
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
    media: File | null;
}

