import * as signalR from "@microsoft/signalr";
import { ConnectorEntity } from "../models/connectorEntity";
const URL = process.env.HUB_ADDRESS ?? "http://localhost:5041/chat"; //or whatever your backend port is
class Connector {
  private connection: signalR.HubConnection;
  private onDialogsTLUpdateCallback: ((dialogs: ConnectorEntity) => void) | null = null;
  private onMessagesTLUpdateCallback: ((messages: ConnectorEntity) => void) | null = null;
  private onMessagesVKUpdateCallback: ((messages: ConnectorEntity) => void) | null = null;
  private onDialogsVKUpdateCallback: ((dialgos: ConnectorEntity) => void) | null = null;


  static instance: Connector;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect()
      .build();
    this.connection.start();
    this.registerEventHandlers();
  }
  public setOnDialogsTLUpdateCallback(callback: (dialogs: ConnectorEntity) => void) {
    this.onDialogsTLUpdateCallback = callback;
  }

  public setOnMessagesTLUpdateCallback(callback: (messages: ConnectorEntity) => void) {
    this.onMessagesTLUpdateCallback = callback;
  }

  public setOnDialogsVKUpdateCallback(callback: (dialogs: ConnectorEntity) => void) {
    this.onDialogsVKUpdateCallback = callback;
  }

  public setOnMessagesVKUpdateCallback(callback: (messages: ConnectorEntity) => void) {
    this.onMessagesVKUpdateCallback = callback;
  }

  private registerEventHandlers() {
    this.connection.on("updateDialogsTL", (dialogs: ConnectorEntity) => {
      console.log(`${JSON.stringify(dialogs, null, 2)}`);
      if (this.onDialogsTLUpdateCallback) {
        this.onDialogsTLUpdateCallback(dialogs);
      }
    });

    this.connection.on("updateMessagesTL", (messages: ConnectorEntity) => {
      console.log(`${JSON.stringify(messages, null, 2)}`);
      if (this.onMessagesTLUpdateCallback) {
        this.onMessagesTLUpdateCallback(messages);
      }
    })

    this.connection.on("updateDialogsVK", (dialogs: ConnectorEntity) => {
      console.log(`${JSON.stringify(dialogs, null, 2)}`);
      if (this.onDialogsVKUpdateCallback) {
        this.onDialogsVKUpdateCallback(dialogs);
      }
    });

    this.connection.on("updateMessagesVK", (messages: ConnectorEntity) => {
      console.log(`${JSON.stringify(messages, null, 2)}`);
      if (this.onMessagesVKUpdateCallback) {
        this.onMessagesVKUpdateCallback(messages);
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