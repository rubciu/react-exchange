import React from 'react';
import NumberFormat from 'react-number-format';

import { Account } from '../../features/exchange/exchangeSlice';
import { AccountType, Operation } from '../../enums';
import { Button, Grid, TextField } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styles from './Input.module.scss';
export type InputProps = {
  amount: number;
  account: Account;
  accountType: AccountType;
  convert: (accountType: AccountType, amount: number) => void;
  setWalletAccountType: any;
  setIsWalletOpened: any;
  operation?: Operation;
};

const Input = ({
  amount,
  account,
  accountType,
  setWalletAccountType,
  setIsWalletOpened,
  convert,
  operation = Operation.Sell,
}: InputProps): JSX.Element => {
  const { Buy, Sell } = Operation;
  const { Current, Destination } = AccountType;

  const convertAmount = (accountType: AccountType, amount: number) => {
    convert(accountType, amount);
  };

  const nextAmount = (balance: number): number | undefined => {
    if (!balance) {
      return;
    }
    let result: number;
    if (amount && operation === Sell) {
      result =
        accountType === Current
          ? balance - amount
          : accountType === Destination
          ? balance + amount
          : balance;
      return Number(result.toFixed(2));
    } else if (amount && operation === Buy) {
      return;
    }
  };

  return (
    <div className={styles.Input} data-test='input-component'>
      <Grid container>
        <Grid item xs={5} md={4} lg={4}>
          <Button
            variant='outlined'
            size='large'
            endIcon={<ExpandMoreIcon />}
            onClick={() => {
              setWalletAccountType(accountType);
              setIsWalletOpened(true);
            }}
          >
            {account.currencyCode}
          </Button>
        </Grid>

        <Grid item xs={7} md={6} lg={8}>
          <NumberFormat
            value={amount}
            thousandSeparator={true}
            decimalScale={2}
            allowNegative={false}
            onValueChange={({ value: amount }) =>
              convertAmount(accountType, Number(amount))
            }
            customInput={TextField}
            suffix={` ${account.currencySymbol}`}
          />
        </Grid>
        <Grid item xs={12}>
          <p className='balance' data-test='balance'>
            <span>Balance: </span>
            <span
              className={`${amount ? 'line-through' : 'null'}`}
              data-test='current-balance'
            >
              {Number(account.balance).toFixed(2)} {account.currencySymbol}
            </span>
            {amount ? (
              <span data-test='next-balance'>
                <span> &#8594; </span>
                {nextAmount(account.balance)}&nbsp;
                {account.currencySymbol}
              </span>
            ) : null}
          </p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Input;
