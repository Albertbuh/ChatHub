"use client";
import { Suspense } from "react";
import DialogContainer from "../dialogContainer/dialogContainer";
import { IDialogInfo } from "@/app/models/dto/IDialogInfo";

export interface MessengerInfo {
  dialogs: Array<IDialogInfo>;
}

export default function MessengerContainer(props: MessengerInfo) {
  function handleClick() {
    alert("aboba");
  }

  return (
    <>
      <Suspense fallback={<p>load dialogs...</p>}>
        <ul style={{ paddingLeft: 0 }}>
          {props.dialogs.map((dialog) => (
            <li key={dialog.id} onClick={handleClick}>
              <DialogContainer dialogInfo={dialog} />
            </li>
          ))}
        </ul>
      </Suspense>
    </>
  );
}

async function handleClick(key: number) {
  let dialogs = [];
  try {
    console.log("start fetch");
    const res = await fetch("http://localhost:5041/api/v1.0/telegram/dialogs");
    if (!res.ok) {
      throw new Error("Unable to get telegram dialogs data");
    }
    dialogs = await res.json();
    console.log(dialogs);
  } catch (error) {
    console.log(error);
  } finally {
    return dialogs;
  }
}
