import { Module } from '../../../../src';
import { MathController } from './controllers';

@Module({
  controllers: [MathController],
})
export class MathModule {}
