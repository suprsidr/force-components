import React, {Component} from 'react';

export default class Home extends Component{
  render() {
    return (
      <div className="row homepage">
        <div className="small-12 columns">
          <h2>Instructions:</h2>
          <ol>
            <li>Paste HTML</li>
            <li>Edite Rendered Items</li>
            <li>Save :)</li>
            <li>Copy New HTML</li>
            <li>Done!</li>
          </ol>
        </div>
      </div>
    )
  }
}
