"use client"
import React, { Suspense, useEffect, useState } from "react";
import MessageList from "../components/messageList/messageList";
import MessengerContainer from "../components/messengerContainer/messengerContainer";
import { IMessageInfo } from "../models/dto/IMessageInfo";
import { GetDialogs } from "../lib/getRequests";
import Connector from "../utils/singnalR-connector"
import { IDialogInfo } from "../models/dto/IDialogInfo";
import DialogContainer from "../components/dialogContainer/dialogContainer";
// import DialogUpdateContainer from "../page"

const MyComponent = () => {

};

export default function Home() {
  const [dialogUpdate, setDialogUpdate] = useState<IDialogInfo[]>([]);

  useEffect(() => {
    const handleDialogsUpdate = (dialogs: IDialogInfo[]) => {
      setDialogUpdate(dialogs);
    };
    const fetchData = async () => {
      try {
        const updatedDialogs = await GetDialogs();
        setDialogUpdate(updatedDialogs);
      } catch (error) {
        console.error('Ошибка при получении диалогов:', error);
      }
    };

    fetchData();
    const connectorInstance = Connector();
    connectorInstance.setOnDialogsUpdateCallback(handleDialogsUpdate);
  }, []);
 
  return (
    <Suspense fallback={<p>load dialogs...</p>}>
                <ul style={{ paddingLeft: 0 }}>
                    {dialogUpdate.map((dialog) => (
                        <li key={dialog.id} onClick={() => {
                            alert(dialog.id);
                            // setCurrentId(dialog.id);
                        }}>
                            <DialogContainer dialogInfo={dialog} />
                        </li>
                    ))}
                </ul>
      </Suspense>
  );
};