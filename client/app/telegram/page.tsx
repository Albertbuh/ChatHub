import { IDialogInfo } from "../models/dto/IDialogInfo";

export default async function Home() {
    let dialogs = await GetDialogs();
    console.log(dialogs);
    return (
        <h1>Dialogs</h1>
    );
}

async function GetDialogs(): Promise<IDialogInfo[]> {
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