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
  onChange(e) {
    let el = document.createElement('div');
    el.innerHTML = e.target.value;
    //console.log(Array.from(el.children));
    this.updateState(Array.from(el.children).map((e) => this.getDomMap(e)));
  }
  getDomMap(el) {
    return {
      attributes: Array.from(el.attributes)
        .reduce((prev, next) => {
          if(next.name === 'class'){
            return prev;
          }
          prev[next.name] = next.value;
          return prev;
        }, {}),
      children: Array.from(el.children).map((child) => this.getDomMap(child)),
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
  createElement(el, i) {
    el.attributes.key = i;
    el.attributes.className = el.classList.length ? el.classList.join(' ') : null;
    var children =  el.children.length > 0 ? el.children.map((child, i) => this.createElement(child, i)) : el.textContent;
    return React.createElement(this.renderEditable(el.tag), el.attributes, this.renderChildren(el.tag) ? children : undefined);
  }
  render() {
    return (
      <div>
        <textarea style={{display: 'block', width: '100%', maxWidth: '960px', height: '400px', margin: '0 auto'}} onChange={(e) => this.onChange(e)}/>
        <div className="main_content homepage">
          {this.state.elements.map((el, i) => this.createElement(el, i))}
        </div>
      </div>
    )
  }
}

export default Home;
