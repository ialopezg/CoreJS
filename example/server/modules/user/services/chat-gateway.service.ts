import { Subject } from 'rxjs';
import { Server } from 'socket.io';

import { Component } from '../../../../../src';
import {
  Gateway,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '../../../../../src/websocket';

@Component()
@WebSocketGateway({ namespace: '', port: 2000 })
export class ChatGatewayService implements Gateway {
  private message$ = new Subject<any>();

  @WebSocketServer()
  private server: any;

  get message() {
    return this.message$.asObservable();
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


  @SubscribeMessage({ value: 'message' })
  onMessage(client: any, data: any) {
    this.message$.next({ client, data });
  }
}
