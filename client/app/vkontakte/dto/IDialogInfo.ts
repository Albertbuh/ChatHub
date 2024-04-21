import { IMessageInfoVK } from "./IMessageInfo";

export interface IDialogInfoVK {
    id: number;
    title: string;
    mainUsername: string;
    photoId: number;
    topMessage: IMessageInfoVK;
}