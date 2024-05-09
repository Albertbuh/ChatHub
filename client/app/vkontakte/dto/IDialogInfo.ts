import { IMessageInfoVK } from "./IMessageInfo";

export interface IDialogInfoVK {
    id: number;
    title: string;
    mainUsername: string;
    photoUrl: string;
    topMessage: IMessageInfoVK;
}
