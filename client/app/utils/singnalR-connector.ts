import * as signalR from "@microsoft/signalr";
import { ConnectorEntity } from "../models/connectorEntity";
const URL = process.env.HUB_ADDRESS ?? "http://localhost:5041/hub";
class Connector {
    private connection: signalR.HubConnection;
    private onDialogsUpdateCallback:
        | ((connectorEntity: ConnectorEntity) => void)
        | null = null;
    private onMessagesUpdateCallback:
        | ((connectorEntity: ConnectorEntity) => void)
        | null = null;
    static instance: Connector;

    constructor(messengerName: string) {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`${URL}/${messengerName}`)
            .withAutomaticReconnect()
            .build();
        this.connection.start();
        this.registerEventHandlers();
    }

    public setOnDialogsUpdateCallback(
        callback: (connectorEntity: ConnectorEntity) => void,
    ) {
        this.onDialogsUpdateCallback = callback;
    }

    public setOnMessagesUpdateCallback(
        callback: (connectorEntity: ConnectorEntity) => void,
    ) {
        this.onMessagesUpdateCallback = callback;
    }

    private registerEventHandlers() {
        this.connection.on("updateDialogs", (connectorEntity: ConnectorEntity) => {
            if (this.onDialogsUpdateCallback) {
                this.onDialogsUpdateCallback(connectorEntity);
            }
        });

        this.connection.on("updateMessages", (connectorEntity: ConnectorEntity) => {
            if (this.onMessagesUpdateCallback) {
                this.onMessagesUpdateCallback(connectorEntity);
            }
        });
    }

    public disconnect() {
        this.resetCallbacks();
        this.connection.stop();
    }

    public resetCallbacks() {
        this.onMessagesUpdateCallback = null;
        this.onDialogsUpdateCallback = null;
    }
}

export default Connector;
