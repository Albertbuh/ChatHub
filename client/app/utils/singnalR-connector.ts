import * as signalR from "@microsoft/signalr";
import { ConnectorEntity } from "../models/connectorEntity";
const URL = process.env.HUB_ADDRESS ?? "http://localhost:5041/chat";

class Connector {
    private connection: signalR.HubConnection;
    private onDialogsTLUpdateCallback: ((connectorEntity: ConnectorEntity) => void) | null = null;
    private onMessagesTLUpdateCallback: ((connectorEntity: ConnectorEntity) => void) | null = null;
    static instance: Connector;

    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(URL)
            .withAutomaticReconnect()
            .build();
        this.connection.start();
        this.registerEventHandlers();
    }

    public setOnDialogsTLUpdateCallback(
        callback: (connectorEntity: ConnectorEntity) => void,
    ) {
        this.onDialogsTLUpdateCallback = callback;
    }

    public setOnMessagesTLUpdateCallback(
        callback: (connectorEntity: ConnectorEntity) => void,
    ) {
        this.onMessagesTLUpdateCallback = callback;
    }

    public resetOnMessagesTLUpdateCallback() {
        this.onMessagesTLUpdateCallback = null;
    }

    private registerEventHandlers() {
        this.connection.on("updateDialogsTL", (connectorEntity: ConnectorEntity) => {
            console.log(`${JSON.stringify(connectorEntity, null, 2)}`);

            if (this.onDialogsTLUpdateCallback) {
                this.onDialogsTLUpdateCallback(connectorEntity);
            }
        });

        this.connection.on("updateMessagesTl", (connectorEntity: ConnectorEntity) => {
            console.log(`${JSON.stringify(connectorEntity, null, 2)}`);

            if (this.onMessagesTLUpdateCallback) {
                this.onMessagesTLUpdateCallback(connectorEntity);
            }
        });
    }

    public static getInstance(): Connector {
        if (!Connector.instance) {
            Connector.instance = new Connector();
        }
        return Connector.instance;
    }
}
export default Connector.getInstance;
