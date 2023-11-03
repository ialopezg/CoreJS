import { Request, Response } from 'express';
import { catchError, EMPTY, map } from 'rxjs';

import { Controller, RequestMapping, Transport } from '../../../../src';
import { ClientProxy } from '../../../../src/microservice/client';
import { Client } from '../../../../src/microservice/decorators';

@Controller()
export class ClientController {
  @Client({ transport: Transport.TCP, port: 5667 })
  client: ClientProxy;

  @RequestMapping({ path: 'client' })
  async sendCommand(_request: Request, response: Response) {
    const result = this.client
      .send({ command: 'add' }, { numbers: [ 1, 2, 3 ] })
      .subscribe((value) => console.log({ value }));
    console.log('result on controller', result);
  }
}
