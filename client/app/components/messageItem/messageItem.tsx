import { IMessageInfo } from "@/app/models/dto/IMessageInfo";
import Timestamp from "../timestamp/timestamp";
import "./messageItem.css";

export default function MessageItem(props: IMessageInfo) {
    return (
        <div className="message">
            <p style={{fontWeight:"bold"}}>{props.sender?.username}</p>
            <p>{props.message}</p><br/>
            <Timestamp time={props.date} className="time"/>
        </div>
    );
}




