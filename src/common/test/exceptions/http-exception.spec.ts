import { HttpException } from '../../exceptions';
import { HttpStatus } from '../../enums';

jest.enableAutomock();

describe('Exception', () => {
  it('constructor is called with enum type', () => {
    const error = new HttpException('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    const getStatus = error.getStatus;

    expect(HttpException).toHaveBeenCalled();
    expect(HttpException).toHaveBeenCalledTimes(1);
    expect(HttpException).toHaveBeenCalledWith('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    expect((<any>getStatus)._isMockFunction).toBe(true);
  });

  it('should calls the constructor with number type', () => {
    const error = new HttpException('Error', 500);
    const getStatus = error.getStatus;

    expect(HttpException).toHaveBeenCalled();
    expect(HttpException).toHaveBeenCalledTimes(2);
    expect(HttpException).toHaveBeenCalledWith('Error', 500);
    expect((<any>getStatus)._isMockFunction).toBe(true);
  });
});

