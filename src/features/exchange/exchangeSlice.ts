import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Operation } from '../../enums';
import type { RootState } from '../../store';

type Rate = {
  symbol: string;
  current: number;
};

export type Transaction = {
  operation: Operation;
  date: string;
  from: string;
  to: string;
  amount: number;
};

export type Account = {
  currencyCode: string;
  balance: number;
  currencySymbol: string;
  transactions: Transaction[];
};

export interface ExchangeState {
  currentAccount: string;
  destinationAccount: string;
  accounts: Account[];
  rates: Rate[];
}

const initialState: ExchangeState = {
  currentAccount: 'EUR',
  destinationAccount: 'USD',
  accounts: [
    {
      currencyCode: 'EUR',
      balance: 500.55,
      currencySymbol: '€',
      transactions: [],
    },
    {
      currencyCode: 'USD',
      balance: 25.24,
      currencySymbol: '$',
      transactions: [],
    },
    {
      currencyCode: 'GBP',
      balance: 642.67,
      currencySymbol: '£',
      transactions: [],
    },
  ],
  rates: [],
};

export const exchangeSlice = createSlice({
  name: 'exchange',
  initialState,
  reducers: {
    setCurrentAccount: (state, action: PayloadAction<string>) => {
      state.currentAccount = action.payload;
    },
    setDestinationAccount: (state, action: PayloadAction<string>) => {
      state.destinationAccount = action.payload;
    },
    setRates: (
      state,
      action: PayloadAction<{
        symbol: string;
        current: number;
        replace?: boolean;
      }>
    ) => {
      const { symbol, current, replace } = action.payload;

      if (state.rates.length > 0 && replace) {
        state.rates.map((rate) =>
          rate.symbol === `${state.currentAccount}/${state.destinationAccount}`
            ? (rate.current = action.payload.current)
            : rate.current
        );
      } else {
        delete action.payload.replace;
        state.rates.push({ symbol, current });
      }
    },
    exchangeAmount: (
      state,
      action: PayloadAction<{
        currentAmount: number;
        destinationAmount: number;
      }>
    ) => {
      const { currentAmount, destinationAmount } = action.payload;

      state.accounts
        .filter((account) => account.currencyCode === state.currentAccount)
        .map((account) => (account.balance -= currentAmount).toFixed(2));

      state.accounts
        .filter((account) => account.currencyCode === state.destinationAccount)
        .map((account) => (account.balance += destinationAmount).toFixed(2));
    },
    switchCurrency: (state) => {
      [state.currentAccount, state.destinationAccount] = [
        state.destinationAccount,
        state.currentAccount,
      ];
    },

    addTransaction: (state, action: PayloadAction<Transaction>) => {
      const { operation, date, amount, from, to } = action.payload;

      state.accounts
        .filter((account) => account.currencyCode === state.currentAccount)
        .map((account) =>
          account.transactions.push({ operation, date, amount, from, to })
        );
    },
  },
});

export const {
  setCurrentAccount,
  setDestinationAccount,
  setRates,
  exchangeAmount,
  switchCurrency,
  addTransaction,
} = exchangeSlice.actions;

export const getCurrentAccount = (state: RootState) =>
  state.exchange.accounts?.filter(
    (account: Account) => account.currencyCode === state.exchange.currentAccount
  )[0];

export const getDestinationAccount = (state: RootState) =>
  state.exchange.accounts?.filter(
    (account: Account) =>
      account.currencyCode === state.exchange.destinationAccount
  )[0];

export const shouldFetchRates = (state: RootState) =>
  !state.exchange.rates.some(
    (rate) =>
      rate.symbol ===
      `${state.exchange.currentAccount}/${state.exchange.destinationAccount}`
  );

export const getAccounts = (state: RootState) => state.exchange.accounts;

export const getRates = (state: RootState): number | undefined =>
  state.exchange.rates.find(
    (rate) =>
      rate.symbol ===
      `${state.exchange.currentAccount}/${state.exchange.destinationAccount}`
  )?.current;

export const getTransactions = (state: RootState): Transaction[] =>
  getCurrentAccount(state).transactions;

export default exchangeSlice.reducer;
