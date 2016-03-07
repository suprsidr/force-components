import React, {Component} from 'react';
import Toolbar from '../Toolbar';
import Modal from 'react-modal';

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
  getEditFields(attributes, tag) {
    console.log(this);
    let retval = [];
    // remove keys we just don't wand editable fields for.
    const { _id, className, updateState, children, ...props } = attributes;
    // attributes
    // require img src attribute
    if(tag === 'img' && !props.src) {
      props.src = '';
    }
    for(let prop in props) {
      retval.push(
        React.createElement('label', {key: `${prop}_${_id}`}, [ `${prop}:`,
          React.createElement('input', {key: `${_id}_${prop}`, ref: `${_id}_attributes_${prop}`, defaultValue: props[prop], style:{width: '100%'}})
        ])
      );
      this.fields.push(`${_id}_attributes_${prop}`);
    }
    // children
    if(Array.isArray(children)) {
      children.forEach((item) => {
        console.log('item: ', item);
        retval = retval.concat(this.getEditFields(item.props, item.type));
      });
    }
    // textContent
    if(!Array.isArray(children) && children !== undefined){
      retval.push(
        React.createElement('label', {key: `textContent_${_id}`}, [ `${tag} ${className || ''} Text:`,
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
    const customStyles = {
      content: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        width: '50%',
        height: '60%'
      }
    };
    if (this.state.editing) {
      return (
        <div ref="editable" style={this.state.dims}>
          <Modal isOpen={this.state.editing} style={customStyles} >
            <div className="flex-it flex-wrap edit-box" style={{position: 'relative'}}>
              <div className="flex-item-auto">
                <div  className="flex-it flex-col controls">
                  {this.getEditFields(this.props, this.type)}
                  <button className="saver button" onClick={(e) => this.save(e)}>Save</button>
                </div>
                <i title="Close" href="#close" className="edit-icon-link" onClick={(e) => this.toggleEditing(e)}>
                  <svg className="icon icon-edit"><use xlinkHref="#icon-cross"/></svg>
                </i>
              </div>
            </div>
          </Modal>
        </div>
      )
    } else {
      return (
        <a ref="editable" {...props} className={`editable-item ${className}`} onClick={(e) => e.preventDefault()}>
          {children}
          {this.props.updateState && <Toolbar onClick={(e) => this.toggleEditing(e)}/>}
        </a>
      )
    }
  }
  render() {
    return this.renderItemOrEdit()
  }
};

export default EditableAnchor;
