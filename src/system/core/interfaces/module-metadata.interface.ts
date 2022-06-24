import { AppModule } from './app-module.interface';
import { Controller } from './controller.interface';

export interface ModuleMetadata {
  modules?: AppModule[];
  components?: any[];
  controllers?: Controller[];
}
