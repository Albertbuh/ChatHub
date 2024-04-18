"use client";
import React, { Suspense, useEffect, useState } from "react";
import { GetDialogs } from "../utils/getRequests";
import Connector from "../utils/singnalR-connector";
import { IDialogInfo } from "../models/dto/IDialogInfo";
import MessengerBase from "./messenger/messengerBase";
import { ConnectorEntity } from "../models/connectorEntity";

export default function Home() {
    const [dialogsUpdate, setDialogsUpdate] = useState<IDialogInfo[]>([]);
    
    const handleDialogsUpdate = (connectorEntity: ConnectorEntity) => {
        setDialogsUpdate(connectorEntity.data as IDialogInfo[]);
    };
    
    const connectorInstance = Connector();
    connectorInstance.setOnDialogsTLUpdateCallback(handleDialogsUpdate);
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

    if (dialogsUpdate.length > 0) {
        return <MessengerBase dialogs={dialogsUpdate} />;
    }
}
