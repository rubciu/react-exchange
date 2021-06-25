import { ShallowWrapper } from 'enzyme';
import { createStore } from 'redux';

import exchangeReducer, {
  ExchangeState,
} from '../features/exchange/exchangeSlice';

/**
 * Creates new store with given a reducer and initalState
 * @param initialState - Representation of the initial state.
 * @returns {Store}
 */
export const storeFactory = (initialState: ExchangeState) =>
  createStore(exchangeReducer, initialState);

/**
 *
 * @param {ShallowWrapper} wrapper - Enzyme shallow wrapper
 * @param {string} value - Value of data-test attribute
 * @returns {ShallowWrapper}
 */
export const findByTestAttr = (wrapper: ShallowWrapper, value: string) => {
  return wrapper.find(`[data-test="${value}"]`);
};
