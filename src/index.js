import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';

import $ from 'jquery';

import I18n from './services/i18n';
import Game from './services/game';

import App from './components/App';

import 'hammerjs';
import 'popper.js';
import './assets/css/index.scss';


window.$ = $;

import('bootstrap').then(() => ReactDOM.render((
  <I18n>
    <Game>
      <HashRouter>
        <Switch>
          <Route component={ App } />
        </Switch>
      </HashRouter>
    </Game>
  </I18n>
), document.getElementById('root')));
