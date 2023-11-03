import { Server } from 'socket.io';

import { Component } from '../../../../src';
import {
  IGateway,
  WebSocketGateway,
  GatewayServer,
  SubscribeMessage,
} from '../../../../src/socket';
import { UserService } from './user.service';
import { Subject } from 'rxjs';

@Component()
@WebSocketGateway({ namespace: '', port: 2000 })
export class ChatGatewayService implements IGateway {
  private message$ = new Subject<any>();

  @GatewayServer
  private server: any;

  get message() {
    return this.message$;
  }

  constructor(private readonly userService: UserService) {
    this.userService.stream$.subscribe((xd) => {
      console.log(xd);
    });
  }

  afterInit(server: Server): void {
    this.server = server;
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

  @SubscribeMessage({ value: 'message' })
  onMessage(client: any, data: any) {
    this.message$.next({ client, data });
  }
}
