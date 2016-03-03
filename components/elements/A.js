import React, {Component} from 'react';

class A extends Component{

  render() {
    return (
      <a {...this.props}>
        {this.props.children}
      </a>
    )
  }
};

export default A;
