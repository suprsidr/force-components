import React, {Component} from 'react';
import { Link } from 'react-router';
import Content from './Content';

class Main extends Component {
  render() {
    return (
      <div id='app'>
        <ul role="nav">
          <li><Link to="/">Home Slides</Link></li>
          <li><Link to="/merch">MerchPack</Link></li>
        </ul>
        <Content />
      </div>
    )
  }
}

export default Main;
