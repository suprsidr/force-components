import React, {Component} from 'react';
import Toolbar from '../Toolbar';

class EditableAnchor extends Component{
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      dims: {
        height: 0,
        width: 0
      }
    };
  }
  toggleEditing(e) {
    e.preventDefault();
    e.stopPropagation();
    const styles = window.getComputedStyle(this.refs.editable, null);
    this.setState({
      editing: !this.state.editing,
      dims: {
        height: styles.getPropertyValue('height'),
        width: styles.getPropertyValue('width')
      }
    });
  }
  getEditFields(attributes) {
    let retval = [];
    const { className, children, ...props } = attributes;
    console.log('attributes: ', props);
    for(let prop in props) {
      retval.push(
        React.createElement('label', {key: prop}, [ `${prop}:`,
          React.createElement('input', {key: prop+1, ref: prop, defaultValue: props[prop], style:{width: '100%'}})
        ])
      );
    }
    if(Array.isArray(children)) {
      children.forEach((item) => {
        retval = retval.concat(this.getEditFields(item.props));
      });
    } else if(children !== undefined){
      let rnd = Math.random();
      retval.push(
        React.createElement('label', {key: `textNode_${rnd}`}, [ `Text:`,
          React.createElement('input', {key: `textNodeInput_${rnd}`, ref: `textNode_${rnd}`, defaultValue: children, style:{width: '100%'}})
        ])
      );
    }
    return retval;
  }
  renderItemOrEdit() {
    // props are immutable, and we need to modify className
    const { className, children, ...props } = this.props;
    if (this.state.editing) {
      return (
        <a ref="editable" {...props} className={`editable-item ${className}`} onClick={(e) => e.preventDefault()}>
          <div className="flex-it flex-wrap edit-box" style={this.state.dims}>
            <div className="flex-item-auto">
              <div  className="flex-it flex-col controls">
                {this.getEditFields(this.props)}
              </div>
              <i title="Close" href="#close" className="edit-icon-link" onClick={(e) => this.toggleEditing(e)}>
                <svg className="icon icon-edit"><use xlinkHref="#icon-cross"/></svg>
              </i>
            </div>
          </div>
        </a>
      )
    } else {
      return (
        <a ref="editable" {...props} className={`editable-item ${className}`}>
          {children}
          <Toolbar onClick={(e) => this.toggleEditing(e)}/>
        </a>
      )
    }
  }
  render() {
    return this.renderItemOrEdit()
  }
};

export default EditableAnchor;
