import { IMessageInfo } from "./IMessageInfo";

export interface IDialogInfo {
    id: number;
    title: string;
    mainUsername: string;
    photoUrl: string;
    topMessage: IMessageInfo;
}
