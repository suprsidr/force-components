import React, {Component} from 'react';

class DIV extends Component{

  render() {
    return (
      <div {...this.props}>
        {this.props.children}
      </div>
    )
  }
};

export default DIV;
