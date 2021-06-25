import React from 'react';
import {
  Avatar,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
} from '@material-ui/core';

import { AccountType } from '../../enums';
import { Account } from '../../features/exchange/exchangeSlice';

type WalletProps = {
  accounts: any;
  open: boolean;
  accountType: AccountType;
  setIsWalletOpened: any; // give type
  setAccount: (accountType: AccountType, currency: string) => void;
};

const Wallet = ({
  accounts,
  open,
  accountType,
  setIsWalletOpened,
  setAccount,
}: WalletProps): JSX.Element => {
  return (
    <div>
      <Drawer
        anchor='right'
        open={open}
        onBackdropClick={() => setIsWalletOpened(false)}
      >
        <Container>
          <List
            component='nav'
            aria-labelledby='nested-list-subheader'
            subheader={
              <ListSubheader component='div' id='nested-list-subheader'>
                Recently used
              </ListSubheader>
            }
          >
            {accounts &&
              accounts.map(
                ({ currencyCode, balance, currencySymbol }: Account) => (
                  <ListItem
                    button
                    key={currencyCode}
                    onClick={() => {
                      setAccount(accountType, currencyCode);
                      setIsWalletOpened(false);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={`${currencyCode}`}
                        src={`/static/images/flags/${currencyCode}.png`}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${currencyCode} - ${balance} ${currencySymbol}`}
                    />
                  </ListItem>
                )
              )}
          </List>
        </Container>
      </Drawer>
    </div>
  );
};

export default Wallet;
