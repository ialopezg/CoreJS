import { Runner } from './core/runner';
import { AppModule } from './app/modules/app';
import { Application } from './app/application';

Runner.run<Application>(Application, AppModule);
