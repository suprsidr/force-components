import React, {Component} from 'react';
import Toolbar from '../Toolbar';

class EditableAnchor extends Component{
  constructor(props) {
    super(props);
    this.fields = [];
    this.state = {
      editing: false,
      dims: {
        height: 0,
        width: 0
      }
    };
  }
  save(e) {
    e.preventDefault();
    this.props.updateState(this.fields.reduce((prev, next) => {
      prev[next] = this.refs[next].value;
      return prev;
    }, {}));
    this.toggleEditing(e);
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
    // remove keys we just don't wand editable fields for.
    const { _id, className, updateState, children, ...props } = attributes;
    for(let prop in props) {
      retval.push(
        React.createElement('label', {key: `${prop}_${_id}`}, [ `${prop}:`,
          React.createElement('input', {key: `${_id}_${prop}`, ref: `${_id}_attributes_${prop}`, defaultValue: props[prop], style:{width: '100%'}})
        ])
      );
      this.fields.push(`${_id}_attributes_${prop}`);
    }
    if(Array.isArray(children)) {
      children.forEach((item) => {
        retval = retval.concat(this.getEditFields(item.props));
      });
    } else if(children !== undefined){
      retval.push(
        React.createElement('label', {key: `textContent_${_id}`}, [ `Text:`,
          React.createElement('input', {key: `${_id}_textContent`, ref: `${_id}_textContent`, defaultValue: children, style:{width: '100%'}})
        ])
      );
      this.fields.push(`${_id}_textContent`);
    }
    return retval;
  }
  renderItemOrEdit() {
    // props are immutable, and we need to modify className
    const { className, updateState, children, ...props } = this.props;
    if (this.state.editing) {
      return (
        <a ref="editable" {...props} className={`editable-item ${className}`} onClick={(e) => e.preventDefault()}>
          <div className="flex-it flex-wrap edit-box" style={this.state.dims}>
            <div className="flex-item-auto">
              <div  className="flex-it flex-col controls">
                {this.getEditFields(this.props)}
                <button className="saver" onClick={(e) => this.save(e)}>Save</button>
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
        <a ref="editable" {...props} className={`editable-item ${className}`} onClick={(e) => e.preventDefault()}>
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
