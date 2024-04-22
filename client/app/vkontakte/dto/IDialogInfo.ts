import { IMessageInfoVK } from "./IMessageInfo";

export interface IDialogInfoVK {
    id: number;
    title: string;
    mainUsername: string;
    photoUri: string;
    topMessage: IMessageInfoVK;
}