import { Component } from '../../../../src';
import { ChatGatewayService } from './chat-gateway.service';

@Component()
export class ChatService {
  constructor(private readonly chatGatewayService: ChatGatewayService) {
    const stream$ = this.chatGatewayService.message;
    stream$.subscribe(this.storeMessage.bind(this));
  }

  private storeMessage(data: any) {
    console.log(data);
  }
}
