'use client';
import Image from "next/image";
import Timestamp from "../timestamp/timestamp";
import "./dialogContainer.css";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";

interface ContainerProps {
    dialogInfo: IDialogInfo;
}

export default function DialogContainer({dialogInfo}: ContainerProps) {
    return (
        <section className="peer-container">
            <Image
                className="image"
                src={"/pidr.png"}
                alt="some text"
                width={50}
                height={50}
            />
            <div className="main-info">
                <div className="head">
                    <p className="truncate" style={{ fontWeight: "bold", width: "70%" }}>
                        {dialogInfo.title}
                    </p>
                    <Timestamp className="" time={dialogInfo.topMessage.date}/>
                </div>
                <div className="body truncate">
                    {dialogInfo.topMessage.sender?.username != dialogInfo.mainUsername &&
                        <span>{dialogInfo.topMessage.sender?.username}:</span>}
                    {dialogInfo.topMessage.message}
                </div>
            </div>
        </section>
    );
}


