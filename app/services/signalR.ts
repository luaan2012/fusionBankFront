import * as signalR from "@microsoft/signalr";

const URL = import.meta.env.VITE_API_URL_EVENT + "notification";

interface NotificationMessage {
  action: string;
  title?: string;
  [key: string]: any; // Para propriedades adicionais do message
}

export class Connector {
  private connection: signalR.HubConnection;
  private userId: string | null = null;

  constructor() {
    console.log("Nova instância do Connector criada."); // Log para depuração
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(URL)
      .withAutomaticReconnect([0, 1000, 5000, 10000])
      .configureLogging(signalR.LogLevel.Debug) // Habilitar logs detalhados
      .build();
  }

  public async startConnection(): Promise<void> {
    if (
      this.connection.state === signalR.HubConnectionState.Disconnected ||
      this.connection.state === signalR.HubConnectionState.Disconnecting
    ) {
      try {
        await this.connection.start();
        console.log("Conexão SignalR iniciada com sucesso.");
      } catch (err) {
        console.error("Erro ao iniciar conexão SignalR:", err);
        throw err;
      }
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.connection.state === signalR.HubConnectionState.Connected) {
      try {
        await this.connection.stop();
        console.log("Conexão SignalR parada.");
        this.userId = null;
      } catch (err) {
        console.error("Erro ao parar conexão SignalR:", err);
      }
    }
  }

  public onReceiveNotification(callback: (message: NotificationMessage) => void): void {
    this.connection.on("ReceiveNotification", (message) => {
      console.log("Mensagem recebida do SignalR:", message);
      callback(message);
    });
  }

  public async joinGroup(userId: string): Promise<void> {
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      try {
        await this.startConnection();
      } catch (err) {
        console.error("Erro ao tentar iniciar a conexão antes de ingressar no grupo:", err);
        throw err;
      }
    }

    try {
      await this.connection.invoke("JoinUserGroup", userId);
      console.log(`Usuário ${userId} entrou no grupo.`);
      this.userId = userId;
    } catch (error) {
      console.error("Erro ao tentar entrar no grupo:", error);
      throw error;
    }
  }

  public async sendMessage(username: string, message: string): Promise<void> {
    try {
      await this.connection.send("newMessage", username, message);
      console.log("Mensagem enviada.");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      throw err;
    }
  }

  public onReconnected(callback: (userId: string | null) => void): void {
    this.connection.onreconnected(async () => {
      console.log("Reconexão SignalR bem-sucedida.");
      if (this.userId) {
        try {
          await this.joinGroup(this.userId);
          callback(this.userId);
        } catch (err) {
          console.error("Erro ao reingressar no grupo após reconexão:", err);
        }
      }
    });
  }

  public onReconnectionFailed(callback: () => void): void {
    this.connection.onreconnecting(() => {
      console.warn("Tentativa de reconexão SignalR em andamento...");
      return false;
    });

    this.connection.onclose((err) => {
      console.error("Conexão SignalR fechada. Falha na reconexão:", err);
      callback();
    });
  }
}