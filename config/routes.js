import React from 'react';
import Main from '../components/Main';
import Merch from '../components/Merch';
import {Route, IndexRoute} from 'react-router';

export default (
  <Route path="/" component={Main}>
    <Route path="merch" component={Merch} />
    <IndexRoute component={Main} />
  </Route>
);
