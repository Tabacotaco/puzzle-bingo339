import React from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import 'hammerjs';
import 'popper.js';

import I18n from './services/i18n';
import Game from './services/game';

import App from './components/App.jsx';
import * as serviceWorker from './serviceWorker';

import './assets/css/index.scss';


window.$ = $;

import('bootstrap').then(() => ReactDOM.render((
  <I18n>
    <Game>
      <App />
    </Game>
  </I18n>
), document.getElementById('root')));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
