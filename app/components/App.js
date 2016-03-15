import React from 'react';
import {render} from 'react-dom';
import { Router, hashHistory } from 'react-router';
import routes from '../config/routes';
import electron from 'electron';

render(
  <Router history={hashHistory}>{routes}</Router>,
  document.getElementById('main-container')
);
