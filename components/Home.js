import React, {Component} from 'react';

/* we only need custom elements for the ones we want to build in the edit features.
import DIV from './elements/DIV';
import H2 from './elements/H2';
import IMG from './elements/IMG';
import SECTION from './elements/SECTION';
import A from './elements/A';*/

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
      console.log(this.state);
    });
  }
  onChange(e) {
    let el = document.createElement('div');
    el.innerHTML = e.target.value;
    console.log(Array.from(el.children));
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
  getElement(el, i) {
    console.log(el);
    el.attributes.key = i;
    el.attributes.className = el.classList.join(' ');
    var children =  el.children.length > 0 ? el.children.map((child, i) => this.getElement(child, i)) : el.textContent;
    return React.createElement(el.tag, el.attributes, this.renderChildren(el.tag) ? children : undefined);
  }
  render() {
    return (
      <div>
        <textarea style={{display: 'block', width: '100%', maxWidth: '960px', height: '400px', margin: '0 auto'}} onChange={(e) => this.onChange(e)}/>
        <div className="main_content homepage">
          {this.state.elements.map((el, i) => this.getElement(el, i))}
        </div>
      </div>
    )
  }
}

export default Home;
