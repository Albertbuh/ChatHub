"use server";
import { useCallback } from "react";
import MessageList from "../components/messageList/messageList";
import MessengerContainer from "../components/messengerContainer/messengerContainer";
import { IMessageInfo } from "../models/dto/IMessageInfo";
import { GetDialogs } from "../lib/getRequests";
import Connector from "../utils/singnalR-connector"
import { IDialogInfo } from "../models/dto/IDialogInfo";

export default async function Home() {
    let dialogs = await GetDialogs();

    useEffect(() => {
      const handleDialogsUpdate = (newDialogs: IDialogInfo[]) => {
        dialogs = newDialogs;
      };
  
      // Регистрируем функцию-обработчик через Connector.getInstance().setOnDialogsUpdateCallback
      const connectorInstance = Connector();
      connectorInstance.setOnDialogsUpdateCallback(handleDialogsUpdate);
    }, []);
    console.log(dialogs);
    return (
        <section>
            <MessengerContainer dialogs={dialogs} />
        </section>
    );
}
