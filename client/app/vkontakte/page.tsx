"use client";
import React, { Suspense, useEffect, useState } from "react";
import { GetDialogsVK, GetMessagesVK } from "../utils/getRequests";
import Connector from "../utils/singnalR-connector";
import { ConnectorEntity } from "../models/connectorEntity";
import List from "./list/list";

import styles from "./vk.module.css";
import Chat from "./chat/chat";
import { IDialogInfoVK } from "./dto/IDialogInfo";
import { IMessageInfoVK } from "./dto/IMessageInfo";
import VKResponse from "./dto/VKResponse";

export default function Home() {
    const [dialogsUpdate, setDialogsUpdate] = useState<IDialogInfoVK[]>([]);
    const [messages, setMessages] = useState<IMessageInfoVK[]>([]);
    const [currentDialogId, setCurrentDialogId] = useState(0);

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

    const [connector] = useState(new Connector('vkontakte'));
    connector.setOnDialogsUpdateCallback(handleDialogsUpdate);
    connector.setOnMessagesUpdateCallback(handleMessagesUpdate);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedDialogs = await GetDialogsVK(0,100);
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

    const handleSendSubmit = async (data: SendData) => {
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
          let message: VKResponse = await response.json();
          let sendedMessage = message.data as IMessageInfoVK;
          if (data) {
              setMessages([sendedMessage, ...messages]);
          }
      }
  };

    if (dialogsUpdate && dialogsUpdate.length > 0) {
        return (
            <div className={styles.container}>
                <List dialogs={dialogsUpdate} handleClick={handleListClick}  />
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

