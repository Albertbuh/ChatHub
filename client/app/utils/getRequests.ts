import { IMessageInfo } from "../models/dto/IMessageInfo";
import { IDialogInfo } from '../models/dto/IDialogInfo';

export async function GetMessages(dialogId: number, offset: number, limit: number): Promise<IMessageInfo[]> {
    const url = "http://localhost:5041/api/v1.0/telegram/peers";
    let messages = [];

    try {
        const res = await fetch(
            `${url}/${dialogId}?offset=${offset}&limit=${limit}`,
        );
        if (!res.ok) {
            throw new Error("Unable to get telegram dialogs data");
        }
        messages = await res.json();
    } catch (error) {
        console.error(error);
    } finally {
        return messages.data;
    }
}

export async function GetDialogs(): Promise<IDialogInfo[]> {
    let dialogs = [];
    try {
        const res = await fetch("http://localhost:5041/api/v1.0/telegram/dialogs",{headers: {
            'Cache-Control': 'no-cache'
          }});
        if (!res.ok) {
            throw new Error("Unable to get telegram dialogs data");
        }
        dialogs = await res.json();
    } catch (error) {
        console.error(error);
    } finally {
        return dialogs.data;
    }
}

