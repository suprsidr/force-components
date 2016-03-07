import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import EditableAnchor from './elements/EditableAnchor';
import html from 'html';

class MerchPack extends Component{
  constructor(props) {
    super(props);
    this.renderingOutput = false,
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
    this.updateState(elements, () => {
      const ta = this.refs.textarea;
      ta.value = this.setTextAreaValue();
    });
  }
  onChange(e) {
    let el = document.createElement('div');
    el.innerHTML = e.target.value;
    //console.log('onChange');
    this.updateState(Array.from(el.children).map((e, i) => this.getDomMap(e, i)));
  }
  setTextAreaValue() {
    this.renderingOutput = true;
    var result = html.prettyPrint(
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          'junk',
          {},
          this.state.elements.map((el) => this.createElement(el))
        )
        )
        .replace(/(^<junk>|<\/junk>$)/g, '')
    );
    this.renderingOutput = false;
    // preserve ampersands in links & src
    //TODO refine this so body ampersands are not affected
    return result.replace(/&amp;/g, '&');
  }
  getDomMap(el, id) {
    return {
      attributes: Array.from(el.attributes)
        .reduce((prev, next) => {
          if(next.name === 'class'){
            return prev;
          }
          // style needs to be converted to an object and camelCase any dashed declarations;
          if(next.name === 'style') {
            prev[next.name] = next.value.replace(/(\;$|\s)/g, '')
              .replace(/-(.)/g, ($0, $1) => $1.toUpperCase())
              .split(';')
              .reduce((prev, next) => {
                var parts = next.split(':');
                prev[parts[0]] = parts[1];
                return prev;
              }, {});
            return prev;
          }
          prev[next.name] = next.value;
          return prev;
        }, {_id: id, key: id}),
      children: Array.from(el.children).map((child, i) => this.getDomMap(child, `${id}_children_${i}`)),
      classList: Array.from(el.classList),
      tag: el.tagName.toLowerCase(),
      textContent: Array.from(el.childNodes).reduce((prev, next) => {
        if(next.nodeType === 3) {
          prev += next.textContent.replace(/(\r\n|\n|\r|\t)/gm,'').replace(/\s{2,}/g, ' ');
        }
        return prev;
      }, '')
    }
  }
  renderChildren(tag) {
    return tag !== 'img';
  }
  renderEditable(tag) {
    return tag === 'a' && !this.renderingOutput ? EditableAnchor : tag;
  }
  createElement(el) {
    el.attributes.className = el.classList.length ? el.classList.join(' ') : null;
    el.attributes.textContent = el.textContent;
    el.attributes.updateState = !this.renderingOutput ? (obj) => this.updateStateFromChild(obj) : null;
    var children =  el.children.length > 0 ? el.children.map((child) => this.createElement(child)) : el.textContent;
    return React.createElement(this.renderEditable(el.tag), el.attributes, this.renderChildren(el.tag) ? children : undefined);
  }
  render() {
    return (
      <div>
        <textarea ref="textarea" placeholder="Paste HTML Here" style={{display: 'block', width: '100%', maxWidth: '960px', height: '400px', margin: '0 auto'}} onChange={(e) => this.onChange(e)}/>
        <div className="main_content homepage">
          {this.state.elements.map((el) => this.createElement(el))}
        </div>
      </div>
    )
  }
}

export default MerchPack;
