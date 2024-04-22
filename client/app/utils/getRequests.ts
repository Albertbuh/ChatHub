import { IMessageInfo } from "../telegram/dto/IMessageInfo";
import { IDialogInfo } from '../telegram/dto/IDialogInfo';

import { IMessageInfoVK } from "../vkontakte/dto/IMessageInfo";
import { IDialogInfoVK } from '../vkontakte/dto/IDialogInfo';



export async function GetMessagesTL(dialogId: number, offset: number, limit: number): Promise<IMessageInfo[]> {
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

export async function GetDialogsTL(): Promise<IDialogInfo[]> {
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

export async function GetMessagesVK(dialogId: number, offset: number, limit: number): Promise<IMessageInfoVK[]> {
    const url = "http://localhost:5041/api/v1.0/vk/peers";
    let messages = [];

    try {
        const res = await fetch(
            `${url}/${dialogId}?offset=${offset}&limit=${limit}`,
        );
        if (!res.ok) {
            throw new Error("Unable to get vk dialogs data");
        }
        messages = await res.json();
    } catch (error) {
        console.error(error);
    } finally {
        return messages.data;
    }
}

export async function GetDialogsVK(offset: number, limit: number): Promise<IDialogInfoVK[]> {
    let dialogs = [];
    try {
        const res = await fetch(`http://localhost:5041/api/v1.0/vk/dialogs?offsetId=${offset}&limit=${limit}`,{headers: {
            'Cache-Control': 'no-cache'
          }});
        if (!res.ok) {
            throw new Error("Unable to get vk dialogs data");
        }
        dialogs = await res.json();
    } catch (error) {
        console.error(error);
    } finally {
        return dialogs.data;
    }
}

