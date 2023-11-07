import { MessagePattern } from '../../../../src/microservices';
import { Controller } from '../../../../src';

@Controller()
export class MathController {
  @MessagePattern({ command: 'add' })
  sum(data: any, response: any) {
    if (!data) {
      return response(new Error('Invalid parameter'));
    }

    const result = (data.numbers ?? []).reduce((a, b) => a + b);

    response(null, result);
  }
}
