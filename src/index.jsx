import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import { RouterStore, startRouter } from 'mobx-router';
import Views from 'Routers';
import DataStore from './Store/DataStore';
import App from './App';

// Styles
import 'Assets/styles/base.scss';
import 'Assets/styles/style.scss';
import 'react-perfect-scrollbar/dist/css/styles.css';

const store = {
  router: new RouterStore(),
  dataStore: new DataStore()
};

startRouter(Views, store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app-container')
);
