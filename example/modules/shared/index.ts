import { Module } from '../../../src';
import { SharedService } from './services';

@Module({
  components: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
