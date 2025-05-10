// signalR.ts
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from '@microsoft/signalr';

export class SignalRService {
  private static instance: SignalRService | null = null;
  private connection: HubConnection | null = null;
  private url: string;
  private accountId: string;
  private messageHandler: (data: any) => void;

  private constructor(url: string, accountId: string, messageHandler: (data: any) => void) {
    this.url = url;
    this.accountId = accountId;
    this.messageHandler = messageHandler;
  }

  public static getInstance(url: string, accountId: string, messageHandler: (data: any) => void): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService(url, accountId, messageHandler);
    } else {
      SignalRService.instance.messageHandler = messageHandler;
      SignalRService.instance.accountId = accountId;
    }

    return SignalRService.instance;
  }

  public async startConnection() {
    if (this.connection && this.connection.state === HubConnectionState.Connected) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(this.url)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.on('ReceiveNotification', this.messageHandler);

    this.connection.onclose((error) => {
      console.warn('SignalR connection closed:', error);
    });

    this.connection.onreconnected(async () => {
      console.log('SignalR reconnected');
      await this.joinGroup();
    });

    try {
      await this.connection.start();
      console.log('SignalR connected');
      await this.joinGroup();
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
    }
  }

  private async joinGroup() {
    if (!this.connection || this.connection.state !== HubConnectionState.Connected) return;
    try {
      await this.connection.invoke('JoinUserGroup', this.accountId);
      console.log(`Joined group for accountId: ${this.accountId}`);
    } catch (err) {
      console.error('Failed to join group:', err);
    }
  }

  public async stopConnection() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      SignalRService.instance = null;
      console.log('SignalR disconnected');
    }
  }
}
