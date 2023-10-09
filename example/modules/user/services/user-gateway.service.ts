import { Server } from 'socket.io';

import { Component } from '../../../../src';
import {
  IGateway,
  SocketGateway,
  SocketServer,
  SubscribeMessage,
} from '../../../../src/socket';
import { UserService } from './user.service';

@Component()
@SocketGateway({ namespace: '', port: 8080 })
export class UserGatewayService implements IGateway {
  static get dependencies() {
    return [UserService];
  }

  @SocketServer
  private server: any;

  constructor(private readonly userService: UserService) {
    console.log('Gateway Service is ready and listening!');
    this.userService.stream$.subscribe((xd) => {
      console.log(xd);
    });
  }

  afterInit(server: Server): void {
    this.server = server;
    console.log(`Server ${server.sockets.name} initialized!`);
  }

  handleConnection(client: any): void {
    console.log(`Client ${client} connected!`);
    setTimeout(() => {
      client.emit('message', { message: 'Hello from the server!' });
    }, 2000);
  }

  handleDisconnect(_client: any): void {
    console.log('Client disconnected');
  }

  @SubscribeMessage({ value: 'message' })
  messageHandler(_client: any, data: any): void {
    console.log('Data', data);
  }
}
