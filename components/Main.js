import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';

class Main extends Component {
  render() {
    return (
      <div>
        <ul role="nav">
          <li><IndexLink to="/">Home</IndexLink></li>
          <li><Link to="/slides" activeStyle={{ color: 'red' }}>Homepage Slides</Link></li>
          <li><Link to="/merch" activeStyle={{ color: 'red' }}>MerchPack</Link></li>
        </ul>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Main;
