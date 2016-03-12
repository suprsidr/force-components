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
  getEditFields(id) {
    // lokup our element from state.elements
    const arr = id.toString().split('_');
    const el = arr.reduce((prev, next) => {
      return prev[next];
    }, this.props.elements);

    let retval = [];
    // remove keys we just don't wand editable fields for.
    const { _id, key, className, updateState, elements, ...props } = el.attributes;
    // attributes
    // require img src attribute
    if(el.tag === 'img' && !props.src) {
      props.src = '';
    }
    for(let prop in props) {
      if(props.hasOwnProperty(prop)) {
        if(prop === 'style') {
          continue;
        }
        retval.push(
          React.createElement('label', {key: `${prop}_${_id}`}, [ `${prop}:`,
            React.createElement('input', {key: `${_id}_${prop}`, ref: `${_id}_attributes_${prop}`, defaultValue: props[prop], style:{width: '100%'}})
          ])
        );
        this.fields.push(`${_id}_attributes_${prop}`);
      }
    }
    // children
    if(Array.isArray(el.children)) {
      el.children.forEach((child) => {
        retval = retval.concat(this.getEditFields(child.attributes._id));
      });
    }
    // textContent
    if(el.textContent !== ''){
      retval.push(
        React.createElement('label', {key: `textContent_${_id}`}, [ `${el.tag} ${className || ''} Text ${_id.slice(-1)}:`,
          React.createElement('input', {key: `${_id}_textContent`, ref: `${_id}_textContent`, defaultValue: el.textContent, style:{width: '100%'}})
        ])
      );
      this.fields.push(`${_id}_textContent`);
    }
    return retval;
  }
  renderItemOrEdit() {
    // props are immutable, and we need to modify className
    const { className, updateState, children, textContent, ...props } = this.props;
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
            <div className="row edit-box" style={{position: 'relative'}}>
              <div className="small-12 columns">
                {this.getEditFields(this.props._id)}
                <button className="saver button" onClick={(e) => this.save(e)}>Save</button>
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
}

export default EditableAnchor;
