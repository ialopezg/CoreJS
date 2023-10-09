import { Module } from '../../../core/decorators';
import { SharedService } from './services/services';

@Module({
  components: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  configure() {
    console.log(`${SharedModule.name} configured`);
  }
}
