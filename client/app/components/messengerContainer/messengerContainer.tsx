"use client";
import { Suspense, useState } from "react";
import DialogContainer from "../dialogContainer/dialogContainer";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";
import MessageList from "../messageList/messageList";

interface MessengerInfo {
    dialogs: IDialogInfo[];
}

export default function MessengerContainer(props: MessengerInfo) {
    let dialogs = props.dialogs;
    const [currentId, setCurrentId] = useState(dialogs[0].id);

    return (
        <>
            <Suspense fallback={<p>load dialogs...</p>}>
                <ul style={{ paddingLeft: 0 }}>
                    {dialogs.map((dialog) => (
                        <li key={dialog.id} onClick={() => {
                            alert(dialog.id);
                            setCurrentId(dialog.id);
                        }}>
                            <DialogContainer dialogInfo={dialog} />
                        </li>
                    ))}
                </ul>
            </Suspense>
            <MessageList dialogId={currentId} offset={0} limit={20} />
        </>
    );
}
