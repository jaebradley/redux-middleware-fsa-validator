import {
  isFSA,
} from 'flux-standard-action';
import {
  CONSOLE_LOG_STYLE,
  CONSOLE_GROUP_NAME,
} from './constants';

const fsaValidator = () => next => (action) => {
  try {
    const returnValue = next(action);
    if (!isFSA(action)) {
      console.group(CONSOLE_GROUP_NAME);
      console.log('%cAction is not a Flux Standard Action', CONSOLE_LOG_STYLE);
      console.log(`%c${JSON.stringify(action, null, 2)}`, CONSOLE_LOG_STYLE);
      console.groupEnd();
    }
    return returnValue;
  } catch (e) {
    console.error('%cSomething went wrong with the FSA Validator ', CONSOLE_LOG_STYLE);
    console.error(e, CONSOLE_LOG_STYLE);
    return null;
  }
};

export default fsaValidator;
