import { IMessageInfo } from "../models/dto/IMessageInfo";
import { IDialogInfo } from "../models/dto/IDialogInfo";

import { IMessageInfoVK } from "../vkontakte/dto/IMessageInfo";
import { IDialogInfoVK } from "../vkontakte/dto/IDialogInfo";
import ResponseDTO from "../models/responseDTO";
import UserInfo from "../models/userInfo";
import { navigate, setCookie } from "./redirect";
import { SendRequest } from "../models/sendRequest";
import MessengerResponse from "../models/dto/TLResponse";

export async function logoutRequest(messenger: string) {
    await fetch(`http://localhost:5041/api/v1.0/${messenger}/logout`);
}

export async function loginRequest(
    messenger: string,
    url: string,
): Promise<boolean> {
    const response = await fetch(
        url,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );

    if (!response.ok) {
        throw new Error("Unable to login");
    }
    const result: ResponseDTO = await response.json();
    if (result.data == null) {
        return false;
    } else if (result.statusCode == 200) {
        let data = result.data as UserInfo;
        localStorage.setItem(`${messenger}_username`, data.username.toString());
        localStorage.setItem(`${messenger}_tag`, data.tag);
        localStorage.setItem(`${messenger}_photoId`, data.photoUrl.toString());
        localStorage.setItem(`${messenger}_id`, data.id.toString());

        setCookie(`${messenger}_id`, data.id.toString());
        navigate(`/${messenger}`);
    }
    return true;
}
export async function GetMessages(
    dialogId: number,
    offset: number,
    limit: number,
): Promise<IMessageInfo[]> {
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
        const res = await fetch("http://localhost:5041/api/v1.0/telegram/dialogs", {
            headers: {
                "Cache-Control": "no-cache",
            },
        });
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

export async function GetMessagesVK(
    dialogId: number,
    offset: number,
    limit: number,
): Promise<IMessageInfoVK[]> {
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

export async function GetDialogsVK(
    offset: number,
    limit: number,
): Promise<IDialogInfoVK[]> {
    let dialogs = [];
    try {
        const res = await fetch(
            `http://localhost:5041/api/v1.0/vk/dialogs?offsetId=${offset}&limit=${limit}`,
            {
                headers: {
                    "Cache-Control": "no-cache",
                },
            },
        );
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

export async function sendMessage(
    messenger: string,
    chatId: number,
    sendData: SendRequest,
): Promise<IMessageInfo|undefined> {
    var response = await fetch(
        `http://localhost:5041/api/v1.0/${messenger}/peers/${chatId}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendData),
        },
    );
    if (response.ok) {
        let message: MessengerResponse = await response.json();
        return message.data as IMessageInfo;
    }
    return undefined;
}
