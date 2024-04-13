'use-client'
import * as signalR from "@microsoft/signalr";
import { IDialogInfo } from "../models/dto/IDialogInfo";
const URL = process.env.HUB_ADDRESS ?? "http://localhost:5041/chat"; //or whatever your backend port is
class Connector {
    private connection: signalR.HubConnection;
    private onDialogsUpdateCallback: ((dialogs: IDialogInfo[]) => void) | null = null;
    static instance: Connector;
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();
        this.connection.start();
        this.registerEventHandlers();
    }
    public setOnDialogsUpdateCallback(callback: (dialogs: IDialogInfo[]) => void) {
        this.onDialogsUpdateCallback = callback;
      }
    
      private registerEventHandlers() {
        this.connection.on("updateDialogsTL", (dialogs: IDialogInfo[]) => {
          if (this.onDialogsUpdateCallback) {
            this.onDialogsUpdateCallback(dialogs);
          }
        });
      }
    public static getInstance(): Connector {
        if (!Connector.instance)
            Connector.instance = new Connector();
        return Connector.instance;
    }
}
export default Connector.getInstance;