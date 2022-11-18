export interface AppGateway {
  afterInit: (server: any) => void;
  handleConnection: (client: any) => void;
  handleDisconnect: (client: any) => void;
}
