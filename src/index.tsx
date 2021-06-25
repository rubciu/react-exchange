import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Grid } from '@material-ui/core';

import App from './components/App/App';
import { store } from './store';

import reportWebVitals from './reportWebVitals';
import './index.css';

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Grid container justify='center'>
      <App />
    </Grid>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
