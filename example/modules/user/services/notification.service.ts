import { Component } from '../../../../src';

@Component()
export class NotificationService {
  public storeNotification(data: any) {
    const notification = this.mapDataToNotification(data);
    console.log(notification);
  }

  private mapDataToNotification(data: any) {
    console.log(data);

    return data;
  }
}
