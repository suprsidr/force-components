import React, {Component} from 'react';

class SECTION extends Component{

  render() {
    return (
      <section {...this.props}>
        {this.props.children}
      </section>
    )
  }
};

export default SECTION;
