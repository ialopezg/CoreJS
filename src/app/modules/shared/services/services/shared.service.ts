import { Component } from '../../../../../core/decorators';

@Component()
export class SharedService {
  constructor() {
    console.log(`${SharedService.name} initialized!`);
  }
}
