import React, {Component} from 'react';
import {render} from 'react-dom';
import Content from './Content';

export default class App extends Component {
  render() {
    return (
      <div id='app'>
        <Content />
      </div>
    )
  }
}

render(<App />, document.getElementById('main-container'));
