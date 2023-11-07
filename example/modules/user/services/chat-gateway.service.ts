import { Subject } from 'rxjs';
import { Server } from 'socket.io';

import { Component } from '../../../../src';
import {
  Gateway,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '../../../../src/websocket';
import { UserService } from './user.service';

@Component()
@WebSocketGateway({ namespace: '', port: 2000 })
export class ChatGatewayService implements Gateway {
  private message$ = new Subject<any>();

  @WebSocketServer()
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
