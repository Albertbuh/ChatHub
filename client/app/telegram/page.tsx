"use client";
import React, {
    Suspense,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { GetDialogs, GetMessages } from "../utils/getRequests";
import Connector from "../utils/singnalR-connector";
import { IDialogInfo } from "../models/dto/IDialogInfo";
import { ConnectorEntity } from "../models/connectorEntity";
import List from "./list/list";

import styles from "./telegram.module.css";
import Chat from "./chat/chat";
import { IMessageInfo } from "../models/dto/IMessageInfo";
import TLResponse from "../models/dto/TLResponse";
import { ExpandContext } from "../components/navbar/expandContxt";

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

    const [connector] = useState(new Connector('telegram'));
    connector.setOnDialogsUpdateCallback(handleDialogsUpdate);
    connector.setOnMessagesUpdateCallback(handleMessagesUpdate);

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
        setMessages([]);
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
        if (response.ok) {
            let message: TLResponse = await response.json();
            let sendedMessage = message.data as IMessageInfo;
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
                <List dialogs={dialogsUpdate} handleClick={handleListClick} />
                <Chat
                    messages={messages.toReversed()}
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
