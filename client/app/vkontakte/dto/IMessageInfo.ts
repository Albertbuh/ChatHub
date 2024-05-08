import { IPeerInfoVK } from "./IPeerInfo";
import {IMediaInfoVK} from "./IMediaInfo"

export interface IMessageInfoVK {
    id: number;
    message: string;
    date: string;
    media: IMediaInfoVK;
    sender: IPeerInfoVK;
}
