import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';

import {
  useAppSelector,
  useAppDispatch,
  useInterval,
} from '../../helpers/hooks';
import {
  getCurrentAccount,
  setRates,
  shouldFetchRates,
  getDestinationAccount,
} from '../../features/exchange/exchangeSlice';
import Exchange from '../Exchange/Exchange';
import { apiEndpoint, POLLING_INTERVAL } from '../../constants';
import './App.css';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const currentAccount = useAppSelector((state) => getCurrentAccount(state));
  const destinationAccount = useAppSelector((state) =>
    getDestinationAccount(state)
  );
  const shouldFetch = useAppSelector((state) => shouldFetchRates(state));

  /**
   * Fetch rates from endpoint and dispatch action to update store with latest rates
   * @param replace {boolean} - Overwrites rates for this currency in the store
   * @returns {void}
   */
  const fetchRates = (replace: boolean = false): void => {
    const symbol = `${currentAccount.currencyCode}/${destinationAccount.currencyCode}`;
    const url = `${apiEndpoint}&symbol=${symbol}`;

    // dispatch(isFetchingRates());

    fetch(url)
      .then((response) => response.json())
      .then(({ response }) => {
        const rate = response[0].c;
        const payload = {
          symbol,
          current: Number(rate),
          replace,
        };

        dispatch(setRates(payload));
      })
      .catch(() => {
        throw new Error(
          'There has been a problem fetching rates, please try again later.'
        );
      });
  };

  useEffect(() => {
    if (shouldFetch) {
      fetchRates();
    }
  }, [currentAccount.currencyCode]);

  useInterval(() => {
    fetchRates(true);
  }, POLLING_INTERVAL);

  return (
    <div className='App' data-test='component-app'>
      <Grid container justify='center'>
        <Grid item xs={10} md={5}>
          <Exchange
            currentAccount={currentAccount}
            destinationAccount={destinationAccount}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
