import { Request, Response } from 'express';
import { catchError, EMPTY, map } from 'rxjs';

import { Controller, RequestMapping, Transport } from '../../../../../src';
import { Client, ClientProxy } from '../../../../../src/microservices';

@Controller()
export class ClientController {
  @Client({ transport: Transport.TCP, port: 5667 })
  client: ClientProxy;

  @RequestMapping({ path: 'client' })
  async sendMessage(_request: Request, response: Response) {
    const command = 'add';
    const pattern = { command };
    const data = [1, 2, 3, 4, 5];

    this.client
      .send(pattern, data)
      .pipe(
        map((value: any) => value),
        catchError((_error: any) => EMPTY),
      )
      .subscribe((result: number) => response.json({
        command,
        result,
      }));
  }
}
