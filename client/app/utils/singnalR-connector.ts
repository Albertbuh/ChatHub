import * as signalR from "@microsoft/signalr";
import { IDialogInfo } from "../models/dto/IDialogInfo";
import { IMessageInfo } from "../models/dto/IMessageInfo";
const URL = process.env.HUB_ADDRESS ?? "http://localhost:5041/chat"; //or whatever your backend port is
class Connector {
  private connection: signalR.HubConnection;
  private onDialogsTLUpdateCallback: ((dialogs: IDialogInfo[]) => void) | null = null;
  private onMessagesTLUpdateCallback: ((messages: IMessageInfo[]) => void) | null = null;
  static instance: Connector;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();
    this.connection.start();
    this.registerEventHandlers();
  }
  public setOnDialogsTLUpdateCallback(callback: (dialogs: IDialogInfo[]) => void) {
    this.onDialogsTLUpdateCallback = callback;
  }

  public setOnMessagesTLUpdateCallback(callback: (messages: IMessageInfo[]) => void) {
    this.onMessagesTLUpdateCallback = callback;
  }

  private registerEventHandlers() {
    this.connection.on("updateDialogsTL", (dialogs: IDialogInfo[]) => {
      console.log(`${JSON.stringify(dialogs, null, 2)}`);

      if (this.onDialogsTLUpdateCallback) {
        this.onDialogsTLUpdateCallback(dialogs);
      }
    });

    this.connection.on("updateMessagesTl", (messages: IMessageInfo[]) => {
      console.log(`${JSON.stringify(messages, null, 2)}`);

      if (this.onMessagesTLUpdateCallback) {
        this.onMessagesTLUpdateCallback(messages);
      }
    })
  }
  public static getInstance(): Connector {
    if (!Connector.instance)
      Connector.instance = new Connector();
    return Connector.instance;
  }
}
export default Connector.getInstance;