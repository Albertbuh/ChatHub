"use client"

import * as PusherPushNotifications from '@pusher/push-notifications-web'
import 'bootstrap/dist/css/bootstrap.min.css';
import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import IMessages from './utils/messages.types';

function App() {
    const [messages, setMessages] = useState<Array<IMessages>>([]);
    const inputRefMessage = useRef<HTMLInputElement>(null);
    const inputRefUsername = useRef<HTMLInputElement>(null);


    useEffect(() => {
        const pusher = new Pusher('ae5518cb781f40049fa7', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe('chat');
        channel.bind('message', function (data: IMessages) {
            
            let allMessages: Array<IMessages> = messages;
            allMessages.push(data);
            setMessages([...allMessages]);
        });

    }, [])





    const handleSumbit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const message = inputRefMessage.current?.value;
        const username = inputRefUsername.current?.value;

        await fetch('http://localhost:5041/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                message
            })
        });
        form.reset();
    }
    console.log(messages);
    return (
        <div className="container">
            <div className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white">
                <div
                    className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom">
                    <input className="fs-5 fw-semibold" ref={inputRefUsername} />
                </div>
                <div className="list-group list-group-flush border-bottom scrollarea">
                    {messages.map((message) =>
                    (
                        <div className="list-group-item list-group-item-action py-3 lh-tight">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <strong className="mb-1">{message.username}</strong>
                            </div>
                            <div className="col-10 mb-1 small">{message.message}</div>
                        </div>
                    )
                    )}
                </div>
            </div>
            <form onSubmit={e => handleSumbit(e)}>
                <input type="text" className="form-control" placeholder="Write a message" ref={inputRefMessage} />
            </form>
        </div>
    );
}

export default App;
