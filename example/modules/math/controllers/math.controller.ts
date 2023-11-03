import { MessagePattern } from '../../../../src/microservice/decorators';
import { Controller } from '../../../../src';

@Controller()
export class MathController {
  @MessagePattern({ command: 'add' })
  sum(data: any, respond) {
    if (!data) {
      return respond(new Error('Invalid parameter'));
    }

    const result = (data.numbers ?? []).reduce((a, b) => a + b);

    respond(null, result);
  }
}
