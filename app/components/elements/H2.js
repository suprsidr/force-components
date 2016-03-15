import React, {Component} from 'react';

class H2 extends Component{

  render() {
    return (
      <h2 {...this.props}>
        {this.props.children}
      </h2>
    )
  }
};

export default H2;
