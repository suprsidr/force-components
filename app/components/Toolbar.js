import React, {Component} from 'react';

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <span className="toolbar">
        <i title="Edit" href="#edit" className="edit-icon-link" onClick={(e) => this.props.onClick(e)}>
          <svg className="icon icon-edit"><use xlinkHref="#icon-pencil"/></svg>
        </i>
      </span>
    )
  }
}


export default Toolbar;
