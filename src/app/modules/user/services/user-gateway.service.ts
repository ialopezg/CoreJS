import { SocketGateway } from '../../../../socket/decorators';
import { IGateway } from '../../../../socket/interfaces';
import { Server } from 'socket.io';

@SocketGateway()
export class UserGatewayService implements IGateway {
  constructor() {
    console.log('Gateway Service is ready and listening!');
  }

  onInit(server: Server): void {
    console.log(`Server ${server.sockets.name} initialized!`);
  }

  connection(client): void {
    console.log(`Client ${client} connected!`);
  }
}
