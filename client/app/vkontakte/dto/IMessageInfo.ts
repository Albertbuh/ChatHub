import { IPeerInfoVK } from "./IPeerInfo";

export interface IMessageInfoVK {
    id: number;
    message: string;
    date: string;
    sender: IPeerInfoVK;
}
