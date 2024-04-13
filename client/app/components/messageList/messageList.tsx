import { IMessageInfo } from "@/app/models/dto/IMessageInfo";
import Message from "../message/message";
import { Suspense, useEffect, useState } from "react";
import { GetMessages } from "@/app/lib/getRequests";

interface MessageListInfo {
    dialogId: number;
    offset: number;
    limit: number;
}

export default async function MessageList(props: MessageListInfo) {
    let messages = await GetMessages(props.dialogId, props.offset, props.limit);

    return (
        <>
            <Suspense fallback={<p>load messages...</p>}>
                <ul style={{ paddingLeft: 0, position: "absolute", top: "2%" }}>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <Message {...message} />
                        </li>
                    ))}
                </ul>
            </Suspense>
        </>
    );
}
