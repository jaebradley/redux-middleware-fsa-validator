import * as fsa from 'flux-standard-action';
import fsaValidator from '.';
import {
  CONSOLE_LOG_STYLE,
  CONSOLE_GROUP_NAME,
} from './constants';

jest.mock('flux-standard-action');

describe('fsaValidator', () => {
  const response = 'next';
  const next = jest.fn().mockImplementation(() => response);
  const action = {};
  const consoleGroup = jest.spyOn(console, 'group');
  const consoleLog = jest.spyOn(console, 'log');
  const consoleGroupEnd = jest.spyOn(console, 'groupEnd');
  const consoleError = jest.spyOn(console, 'error');
  let isFSA;

  afterEach(() => {
    isFSA.mockClear();
    consoleGroup.mockClear();
    consoleLog.mockClear();
    consoleGroupEnd.mockClear();
    consoleError.mockClear();
  });

  it('does not log when is FSA', () => {
    isFSA = jest.spyOn(fsa, 'isFSA').mockImplementation(() => true);
    const value = fsaValidator()(next)(action);
    expect(value).toEqual(response);
    expect(isFSA).toHaveBeenCalledTimes(1);
    expect(isFSA).toHaveBeenCalledWith(action);
    expect(consoleGroup).not.toHaveBeenCalled();
    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleGroupEnd).not.toHaveBeenCalled();
  });

  it('does log when is not FSA', () => {
    isFSA = jest.spyOn(fsa, 'isFSA').mockImplementation(() => false);
    const value = fsaValidator()(next)(action);
    expect(value).toEqual(response);
    expect(isFSA).toHaveBeenCalledTimes(1);
    expect(isFSA).toHaveBeenCalledWith(action);
    expect(consoleGroup).toHaveBeenCalledTimes(1);
    expect(consoleGroup).toHaveBeenCalledWith(CONSOLE_GROUP_NAME);
    expect(consoleLog).toHaveBeenCalledTimes(2);
    expect(consoleLog).toHaveBeenCalledWith('%cAction is not a Flux Standard Action', CONSOLE_LOG_STYLE);
    expect(consoleLog).toHaveBeenCalledWith(`%c${JSON.stringify(action, null, 2)}`, CONSOLE_LOG_STYLE);
    expect(consoleGroupEnd).toHaveBeenCalledTimes(1);
  });

  it('does log when error is thrown', () => {
    const error = new Error('test');
    isFSA = jest.spyOn(fsa, 'isFSA').mockImplementation(() => { throw error; });
    const value = fsaValidator()(next)(action);
    expect(value).toBeNull();
    expect(isFSA).toHaveBeenCalledTimes(1);
    expect(isFSA).toHaveBeenCalledWith(action);
    expect(consoleGroup).not.toHaveBeenCalled();
    expect(consoleLog).not.toHaveBeenCalled();
    expect(consoleGroupEnd).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledTimes(2);
    expect(consoleError).toHaveBeenCalledWith('%cSomething went wrong with the FSA Validator ', CONSOLE_LOG_STYLE);
    expect(consoleError).toHaveBeenCalledWith(error, CONSOLE_LOG_STYLE);
  });
});
