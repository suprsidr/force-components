import React, {Component} from 'react';
import { Link, IndexLink } from 'react-router';

class Main extends Component {
  render() {
    return (
      <div>
        <div className="top-bar" role="nav">
          <div className="top-bar-left">
            <ul className="menu">
              <li className="menu-text">ForceRC Markup Generator</li>
              <li><IndexLink to="/">Home</IndexLink></li>
              <li><Link to="/slides" activeStyle={{ color: 'red' }}>Homepage Slides</Link></li>
              <li><Link to="/merch" activeStyle={{ color: 'red' }}>MerchPack</Link></li>
            </ul>
          </div>
          <div className="top-bar-right">
            <ul className="menu">
              <li><input type="search" placeholder="Search" /></li>
              <li><button type="button" className="button">Search</button></li>
            </ul>
          </div>
        </div>
        <p>&nbsp;</p>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default Main;
