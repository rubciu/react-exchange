import { AnyAction, Store } from '@reduxjs/toolkit';
import {
  exchangeAmount,
  ExchangeState,
  setCurrentAccount,
  setDestinationAccount,
  setRates,
  switchCurrency,
} from '../../features/exchange/exchangeSlice';
import { storeFactory } from '../../helpers/testUtils';

describe('Reducer: exchangeSlice', () => {
  let store: Store<ExchangeState, AnyAction>;
  let state: ExchangeState;
  const initialState: ExchangeState = {
    currentAccount: '',
    destinationAccount: '',
    accounts: [
      {
        currencyCode: 'EUR',
        balance: 250,
        currencySymbol: '€',
        transactions: [],
      },
      {
        currencyCode: 'USD',
        balance: 25,
        currencySymbol: '$',
        transactions: [],
      },
    ],
    rates: [],
  };

  beforeEach(() => {
    store = storeFactory(initialState);
    state = store.getState();
  });

  test('set current account', () => {
    const expectedState = {
      ...state,
      currentAccount: 'EUR',
    };

    store.dispatch(setCurrentAccount('EUR'));
    const newState = store.getState();

    expect(newState).toEqual(expectedState);
  });

  test('set destination account', () => {
    const expectedState = {
      ...state,
      destinationAccount: 'USD',
    };

    store.dispatch(setDestinationAccount('USD'));
    const newState = store.getState();

    expect(newState).toEqual(expectedState);
  });

  test('switch currency between accounts', () => {
    store.dispatch(setCurrentAccount('EUR'));
    store.dispatch(setDestinationAccount('USD'));

    const expectedState = {
      ...state,
      currentAccount: 'USD',
      destinationAccount: 'EUR',
    };

    store.dispatch(switchCurrency());

    const newState = store.getState();
    expect(newState).toEqual(expectedState);
  });

  test('should add rates', () => {
    const payload = {
      symbol: 'EUR/USD',
      current: 1.20683,
      replace: true,
    };
    const expectedState = {
      ...initialState,
      currentAccount: 'EUR',
      rates: [{ symbol: 'EUR/USD', current: 1.20683 }],
    };

    store.dispatch(setCurrentAccount('EUR'));
    store.dispatch(setRates(payload));

    const newState = store.getState();
    expect(newState).toEqual(expectedState);
  });

  test('should exchange money', () => {
    const payload = { currentAmount: 10, destinationAmount: 30 };
    const expectedState = {
      ...initialState,
      currentAccount: 'EUR',
      destinationAccount: 'USD',
      accounts: [
        {
          currencyCode: 'EUR',
          balance: 240,
          currencySymbol: '€',
          transactions: [],
        },
        {
          currencyCode: 'USD',
          balance: 55,
          currencySymbol: '$',
          transactions: [],
        },
      ],
    };

    store.dispatch(setCurrentAccount('EUR'));
    store.dispatch(setDestinationAccount('USD'));
    store.dispatch(exchangeAmount(payload));

    const newState = store.getState();
    expect(newState).toEqual(expectedState);
  });
});
