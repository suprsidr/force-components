import React from 'react';
import Main from '../components/Main';
import Content from '../components/Content';
import Merch from '../components/Merch';
import Home from '../components/Home';
import Tools from '../components/Tools';
import {Route, IndexRoute} from 'react-router';

export default (
  <Route path="/" component={Main}>
    <Route path="/slides" component={Content} />
    <Route path="/merch" component={Merch} />
    <Route path="/tools" component={Tools} />
    <IndexRoute component={Home} />
  </Route>
);
