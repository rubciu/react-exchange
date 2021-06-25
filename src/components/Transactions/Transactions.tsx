import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from '@material-ui/core';
import React from 'react';
import CachedIcon from '@material-ui/icons/Cached';
import { Operation } from '../../enums';
import { Account } from '../../features/exchange/exchangeSlice';

type TransactionsProps = {
  account: Account;
};
const Transactions = ({ account }: TransactionsProps): JSX.Element => {
  const { transactions } = account;

  return (
    <div>
      <h3>Transactions</h3>
      <List>
        {transactions &&
          transactions.map(({ operation, date, amount, from, to }) => {
            const text = `${
              operation === Operation.Sell ? 'Sold ' : 'Bought '
            } ${from} to ${to}`;
            const amountAfter = `${
              operation === Operation.Sell ? '-' : '+'
            } ${amount.toFixed(2)} ${account.currencySymbol}`;

            return (
              <ListItem>
                <ListItemAvatar>
                  <IconButton aria-label='transaction'>
                    <CachedIcon />
                  </IconButton>
                </ListItemAvatar>
                <ListItemText primary={text} secondary={date} />
                <ListItemSecondaryAction>
                  <ListItemText primary={amountAfter} />
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
      </List>
    </div>
  );
};

export default Transactions;
