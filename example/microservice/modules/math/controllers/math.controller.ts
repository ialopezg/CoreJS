import { MessagePattern } from '../../../../../src/microservices';
import { Controller } from '../../../../../src';

@Controller()
export class MathController {
  @MessagePattern({ command: 'add' })
  sum(data: any, response: any) {
    const result = (data ?? []).reduce((a: number, b: number) => a + b);

    response(null, result);
  }
}
