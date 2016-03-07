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
              <li><Link to="/slides" activeStyle={{ color: '#00d8ff' }}>Homepage Slides</Link></li>
              <li><Link to="/merch" activeStyle={{ color: '#00d8ff' }}>MerchPack</Link></li>
            </ul>
          </div>
          <div className="top-bar-right">
            <ul className="menu">
              <li>Built with</li>
              <li>
                <a className="react-link" href="https://facebook.github.io/react/">
                  <img width="36" height="36" src="img/react-logo.svg"/>
                  React
                </a>
              </li>
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
