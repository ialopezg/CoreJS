import { Component } from '../../../../src/common/decorators';
import { Subject } from 'rxjs';

@Component()
export class SharedService {
  public stream$ = new Subject<string>();

  constructor() {
    setTimeout(() => {
      this.stream$.next('XD');
    }, 3000);

    console.log(`${SharedService.name} initialized!`);
  }
}
