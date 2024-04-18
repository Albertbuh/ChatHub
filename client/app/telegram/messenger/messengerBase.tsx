"use client";

import DialogItem from "@/app/components/dialogItem/dialogItem";
import MessageItem from "@/app/components/messageItem/messageItem";
import { GetMessages } from "@/app/utils/getRequests";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import { IMessageInfo } from "@/app/models/dto/IMessageInfo";
import { Suspense, useEffect, useState } from "react";
import Connector from "../../utils/singnalR-connector";
import { ConnectorEntity } from "@/app/models/connectorEntity";

interface IMessageBaseProps {
    dialogs: IDialogInfo[];
}

export default function MessengerBase({ dialogs }: IMessageBaseProps) {
    const [currentId, setCurrentId] = useState(0);
    const [messages, setMessages] = useState<IMessageInfo[]>([]);

    const connector = Connector();
    const handleMessagesUpdate = (connectorEntity: ConnectorEntity) => {
        if(connectorEntity.id == currentId)        
            setMessages(connectorEntity.data as IMessageInfo[]);
    };
    connector.setOnMessagesTLUpdateCallback(handleMessagesUpdate);
    
    useEffect(() => {
        const UpdateMessages = async () => {
            if (currentId == 0) 
                return;

            const newMessages = await GetMessages(currentId, 0, 20);
            setMessages(newMessages);
        };

        UpdateMessages();
    }, [currentId]);

    return (
        <>
            <Suspense fallback={<p>load dialogs...</p>}>
                <ul style={{}}>
                    {dialogs.map((dialog) => (
                        <li
                            key={dialog.id}
                            onClick={() => {
                                setCurrentId(dialog.id);
                            }}
                        >
                            <DialogItem dialogInfo={dialog} />
                        </li>
                    ))}
                </ul>
            </Suspense>
            <Suspense fallback={<p>load messages...</p>}>
                <ul style={{}}>
                    {messages.map((message) => (
                        <li key={message.id}>
                            <MessageItem {...message} />
                        </li>
                    ))}
                </ul>
            </Suspense>
        </>
    );
}
