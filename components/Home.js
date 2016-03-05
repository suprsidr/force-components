import React, {Component} from 'react';

/* we only need custom elements for the ones we want to build in the edit features.
import DIV from './elements/DIV';
import H2 from './elements/H2';
import IMG from './elements/IMG';
import SECTION from './elements/SECTION';
import A from './elements/A';*/

import EditableAnchor from './elements/EditableAnchor';

class Home extends Component{
  constructor(props) {
    super(props);
    this.arr = [];
    this.state = {
      elements: []
    };
  }
  updateState(els, cb) {
    this.setState({elements: els}, () => {
      cb && cb();
      console.log('state: ', this.state);
    });
  }
  // receive and object of element attributes and their values
  updateStateFromChild(obj) {
    const keys = Object.keys(obj);
    const elements = this.state.elements.slice();

    keys.forEach((key) => {
      const arr = key.split('_');
      const last = arr.pop();
      const el = arr.reduce((prev, next) => {
        return prev[next];
      }, elements);
      el[last] = obj[key];
    });
    this.updateState(elements);
  }
  onChange(e) {
    let el = document.createElement('div');
    el.innerHTML = e.target.value;
    //console.log(Array.from(el.children));
    this.updateState(Array.from(el.children).map((e, i) => this.getDomMap(e, i)));
  }
  getDomMap(el, id) {
    return {
      attributes: Array.from(el.attributes)
        .reduce((prev, next) => {
          if(next.name === 'class'){
            return prev;
          }
          prev[next.name] = next.value;
          return prev;
        }, {_id: id, key: id}),
      children: Array.from(el.children).map((child, i) => this.getDomMap(child, `${id}_children_${i}`)),
      classList: Array.from(el.classList),
      tag: el.tagName,
      textContent: Array.from(el.childNodes).reduce((prev, next) => {
        if(next.nodeType === 3) {
          prev += next.textContent.replace(/(\r\n|\n|\r|\t)/gm,'').replace(/\s{2,}/g, ' ');
        }
        return prev;
      }, '')
    }
  }
  renderChildren(tag) {
    return tag.toLowerCase() !== 'img';
  }
  renderEditable(tag) {
    return tag.toLowerCase() === 'a' ? EditableAnchor : tag;
  }
  createElement(el) {
    el.attributes.className = el.classList.length ? el.classList.join(' ') : null;
    el.attributes.updateState = (obj) => this.updateStateFromChild(obj);
    var children =  el.children.length > 0 ? el.children.map((child) => this.createElement(child)) : el.textContent;
    return React.createElement(this.renderEditable(el.tag), el.attributes, this.renderChildren(el.tag) ? children : undefined);
  }
  render() {
    return (
      <div>
        <textarea style={{display: 'block', width: '100%', maxWidth: '960px', height: '400px', margin: '0 auto'}} onChange={(e) => this.onChange(e)}/>
        <div className="main_content homepage">
          {this.state.elements.map((el) => this.createElement(el))}
        </div>
      </div>
    )
  }
}

export default Home;
