import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import uuidv4 from 'uuid/v4';
import $ from 'jquery';

import I18n from './services/i18n';
import routers from './services/router';
import Game from './services/game';

import * as serviceWorker from './serviceWorker';

import 'hammerjs';
import 'popper.js';
import './assets/css/index.scss';


window.$ = $;

import('bootstrap').then(() => ReactDOM.render((
  <I18n>
    <HashRouter>
      <Game>
        <Switch>
          { routers.map(options => <Route key={uuidv4()} {...options} />) }
        </Switch>
      </Game>
    </HashRouter>
  </I18n>
), document.getElementById('root')));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
