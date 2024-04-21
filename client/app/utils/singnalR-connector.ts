import * as signalR from "@microsoft/signalr";
import { ConnectorEntity } from "../models/connectorEntity";
const URL = process.env.HUB_ADDRESS ?? "http://localhost:5041/chat"; //or whatever your backend port is
class Connector {
    private connection: signalR.HubConnection;
    private onDialogsTLUpdateCallback: ((connectorEntity: ConnectorEntity) => void) | null = null;
    private onMessagesTLUpdateCallback: ((connectorEntity: ConnectorEntity) => void) | null = null;
    private onDialogsVKUpdateCallback: ((connectorEntity: ConnectorEntity) => void) | null = null;
    private onMessagesVKUpdateCallback: ((connectorEntity: ConnectorEntity) => void) | null = null;
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

    public setOnDialogsVKUpdateCallback(
        callback: (connectorEntity: ConnectorEntity) => void,
    ) {
        this.onDialogsVKUpdateCallback = callback;
    }

    public setOnMessagesVKUpdateCallback(
        callback: (connectorEntity: ConnectorEntity) => void,
    ) {
        this.onMessagesVKUpdateCallback = callback;
    }


    public resetOnMessagesTLUpdateCallback() {
        this.onMessagesTLUpdateCallback = null;
    }

    private registerEventHandlers() {
        this.connection.on("updateDialogsTL", (connectorEntity: ConnectorEntity) => {

            if (this.onDialogsTLUpdateCallback) {
                this.onDialogsTLUpdateCallback(connectorEntity);
            }
        });

        this.connection.on("updateMessagesTl", (connectorEntity: ConnectorEntity) => {

            if (this.onMessagesTLUpdateCallback) {
                this.onMessagesTLUpdateCallback(connectorEntity);
            }
        });

        this.connection.on("updateDialogsVK", (connectorEntity: ConnectorEntity) => {

            if (this.onDialogsVKUpdateCallback) {
                this.onDialogsVKUpdateCallback(connectorEntity);
            }
        });

        this.connection.on("updateMessagesVK", (connectorEntity: ConnectorEntity) => {

            if (this.onMessagesVKUpdateCallback) {
                this.onMessagesVKUpdateCallback(connectorEntity);
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