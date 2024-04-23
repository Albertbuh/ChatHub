import { IPeerInfo } from "./IPeerInfo";

export interface IMessageInfo {
    id: number;
    message: string;
    date: string;
    sender: IPeerInfo;
}
