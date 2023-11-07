import { Request, Response } from 'express';
import { map } from 'rxjs';

import { Controller, RequestMapping, Transport } from '../../../../src';
import { Client, ClientProxy } from '../../../../src/microservices';

@Controller()
export class ClientController {
  @Client({ transport: Transport.TCP, port: 5667 })
  client: ClientProxy;

  @RequestMapping({ path: 'client' })
  async sendCommand(_request: Request, response: Response) {
    const command = 'add';

    const result = this.client
      .send({ command }, { numbers: [ 1, 2, 3 ] })
      .pipe(map((value) => value))
      .subscribe((value) => response.json({
        command,
        result: value,
      }));
  }
}
