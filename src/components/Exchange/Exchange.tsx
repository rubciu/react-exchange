import React from 'react';
import {
  Button,
  CardContent,
  Grid,
  IconButton,
  Paper,
} from '@material-ui/core';
import SwapVertIcon from '@material-ui/icons/SwapVert';

import { useAppSelector, useAppDispatch } from '../../helpers/hooks';
import {
  getAccounts,
  setCurrentAccount,
  setDestinationAccount,
  exchangeAmount,
  switchCurrency,
  addTransaction,
  getRates,
  Account,
} from '../../features/exchange/exchangeSlice';
import Input from '../Input/Input';
import { AccountType, Operation } from '../../enums';
import Wallet from '../Wallet/Wallet';
import styles from './Exchange.module.scss';
import { getNowFormatted } from '../../helpers/utils';
import Transactions from '../Transactions/Transactions';

type ExchangeProps = {
  currentAccount: Account;
  destinationAccount: Account;
};

const Exchange = ({
  currentAccount,
  destinationAccount,
}: ExchangeProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [operation, setOperation] = React.useState<Operation>(Operation.Sell);
  const [isWalletOpened, setIsWalletOpened] = React.useState<boolean>(false);
  const [walletAccountType, setWalletAccountType] = React.useState<AccountType>(
    AccountType.Current
  );
  const [currentAmount, setCurrentAmount] = React.useState<number>(0);
  const [destinationAmount, setDestinationAmount] = React.useState<number>(0);
  const accounts = useAppSelector((state) => getAccounts(state));
  const rate: number | undefined = useAppSelector((state) => getRates(state));
  const { Current, Destination } = AccountType;

  /**
   * Converts current input amount and updates local state.
   * @param accountType {string} - Current or Destination
   * @param amount {number} - Amount to convert
   * @returns {void}
   */
  const convert = (accountType: AccountType, amount: number): void => {
    let convertedAmount: number;

    if (rate && accountType === Current) {
      convertedAmount = Number(amount) * rate;
      setCurrentAmount(Number(amount));
      setDestinationAmount(Number(convertedAmount.toFixed(2)));
    } else if (rate && accountType === Destination) {
      convertedAmount = Number(amount) / rate;
      setDestinationAmount(Number(amount));
      setCurrentAmount(Number(convertedAmount.toFixed(2)));
    }
  };

  /**
   * Dispatchs action to update accounts balance in the store with amounts from local state.\
   * @returns {void}
   */
  const exchange = (): void => {
    dispatch(
      exchangeAmount({
        currentAmount,
        destinationAmount,
      })
    );
    dispatch(
      addTransaction({
        operation,
        date: getNowFormatted(),
        amount: currentAmount,
        from: currentAccount.currencyCode,
        to: destinationAccount.currencyCode,
      })
    );
    setCurrentAmount(0);
    setDestinationAmount(0);
  };

  /**
   * Updates store account with selected currency
   * @param accountType {AccountType} Current or Destination
   * @param currency {string} currency to set in account type
   */
  const setAccount = (accountType: AccountType, currency: string): void => {
    if (accountType === Current) {
      dispatch(setCurrentAccount(currency));
    } else if (accountType === Destination) {
      dispatch(setDestinationAccount(currency));
    }
  };

  /**
   * Filters accounts to not show same account in both inputs
   * @param accounts {Account[]} All accounts
   * @returns {Account[]} - Filtered accounts
   */
  const accountsForWallet = ((accounts: Account[]) => {
    if (walletAccountType === AccountType.Current) {
      return accounts.filter(
        ({ currencyCode }) => currencyCode !== destinationAccount.currencyCode
      );
    }

    if (walletAccountType === AccountType.Destination) {
      return accounts.filter(
        ({ currencyCode }) => currencyCode !== currentAccount.currencyCode
      );
    }
  })(accounts);

  return (
    <div className={styles.Exchange}>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <h1>Sell {currentAccount.currencyCode}</h1>
        </Grid>
        <Grid item xs={12}>
          <small className='market-order'>
            Market order: 1 {currentAccount.currencySymbol} ={rate}{' '}
            {destinationAccount.currencySymbol}
          </small>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0}>
            <CardContent>
              <Input
                amount={currentAmount}
                account={currentAccount}
                accountType={AccountType.Current}
                convert={convert}
                setWalletAccountType={setWalletAccountType}
                setIsWalletOpened={setIsWalletOpened}
              />
            </CardContent>
          </Paper>
        </Grid>
        <Grid container justify='center'>
          <IconButton size='medium' onClick={() => dispatch(switchCurrency())}>
            <SwapVertIcon />
          </IconButton>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0}>
            <CardContent>
              <Input
                amount={destinationAmount}
                account={destinationAccount}
                accountType={AccountType.Destination}
                setWalletAccountType={setWalletAccountType}
                setIsWalletOpened={setIsWalletOpened}
                convert={convert}
              />
            </CardContent>
          </Paper>
        </Grid>
        <Grid justify='center' container>
          <div>
            <Button
              color='primary'
              variant='contained'
              onClick={() => exchange()}
            >
              {`Exchange ${currentAccount.currencyCode} to ${destinationAccount.currencyCode}`}
            </Button>
          </div>
        </Grid>

        <Grid item xs={12}>
          <Transactions account={currentAccount} />
        </Grid>
      </Grid>

      <Wallet
        accounts={accountsForWallet}
        open={isWalletOpened}
        accountType={walletAccountType}
        setIsWalletOpened={setIsWalletOpened}
        setAccount={setAccount}
      />
    </div>
  );
};

export default Exchange;
