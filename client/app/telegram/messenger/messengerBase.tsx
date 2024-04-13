"use client";

import DialogItem from "@/app/components/dialogItem/dialogItem";
import MessageItem from "@/app/components/messageItem/messageItem";
import { GetMessages } from "@/app/lib/getRequests";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import { IMessageInfo } from "@/app/models/dto/IMessageInfo";
import { Suspense, useEffect, useState } from "react";

interface IMessageBaseProps {
    dialogs: IDialogInfo[]
}

export default function MessengerBase({ dialogs }: IMessageBaseProps) {
    const [currentId, setCurrentId] = useState(dialogs[0].id);
    const [messages, setMessages] = useState<IMessageInfo[]>([]);

    useEffect(() => {
        const UpdateMessages = async () => {
            const newMessages = await GetMessages(currentId, 0, 20);
            setMessages(newMessages);
        };

        UpdateMessages();
    }, [currentId]);

    return (
        <>
            <Suspense fallback={<p>load dialogs...</p>}>
                <ul style={{ paddingLeft: 0 }}>
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
                <ul style={{ paddingLeft: 0, position: "absolute", top: "2%" }}>
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
