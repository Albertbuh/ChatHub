"use server";
import { useCallback } from "react";
import MessageList from "../components/messageList/messageList";
import MessengerContainer from "../components/messengerContainer/messengerContainer";
import { IMessageInfo } from "../models/dto/IMessageInfo";
import { GetDialogs } from "../lib/getRequests";

export default async function Home() {
    let dialogs = await GetDialogs();
    return (
        <section>
            <MessengerContainer dialogs={dialogs} />
        </section>
    );
}
