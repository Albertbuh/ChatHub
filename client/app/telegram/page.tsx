"use server";
import { GetDialogs } from "../lib/getRequests";
import MessengerBase from "./messenger/messengerBase";

export default async function Home() {
    let dialogs = await GetDialogs();
    
    return(
        <MessengerBase dialogs={dialogs}/>
    );
    
}
