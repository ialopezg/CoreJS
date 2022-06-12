import { Exception } from '../exceptions';
import { HttpStatus } from '../enums';

jest.enableAutomock();

describe('Exception', () => {
  it('constructor is called with enum type', () => {
    const error = new Exception('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    const getStatus = error.getStatus;

    expect(Exception).toHaveBeenCalled();
    expect(Exception).toHaveBeenCalledTimes(1);
    expect(Exception).toHaveBeenCalledWith('Error', HttpStatus.INTERNAL_SERVER_ERROR);
    expect((<any>getStatus)._isMockFunction).toBe(true);
  });

  it('should calls the constructor with number type', () => {
    const error = new Exception('Error', 500);
    const getStatus = error.getStatus;

    expect(Exception).toHaveBeenCalled();
    expect(Exception).toHaveBeenCalledTimes(2);
    expect(Exception).toHaveBeenCalledWith('Error', 500);
    expect((<any>getStatus)._isMockFunction).toBe(true);
  });
});

