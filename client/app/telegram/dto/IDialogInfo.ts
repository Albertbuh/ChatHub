import { IMessageInfo } from "./IMessageInfo";

export interface IDialogInfo {
    id: number;
    title: string;
    mainUsername: string;
    photoId: number;
    topMessage: IMessageInfo;
}