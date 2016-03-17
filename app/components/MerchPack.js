import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import EditableAnchor from './elements/EditableAnchor';
import html from 'html';

class MerchPack extends Component{
  constructor(props) {
    super(props);
    this.renderingOutput = false;
    this.state = {
      elements: []
    };
    this.editing = false;
    this.ctrlKeyPressed = false;
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
    this.updateState(Array.from(el.children).map((e, i) => this.getDomMap(e, i)));
    if(this.editing) {
      this.editing = false;
      return;
    }
    this.refs.resultsTab.click();
  }
  onKeyUp(e) {
    if(e.keyCode === 17) {
      this.ctrlKeyPressed = false;
    }
  }
  onKeyDown(e) {
    if(e.keyCode === 17) {
      return this.ctrlKeyPressed = true;
    }
    if(this.ctrlKeyPressed && e.keyCode === 86) {
      return;
    }
    this.editing = true;
  }
  onTabClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if(e.target.classList.contains('is-active')) return;
    let sib = e.target.parentNode.parentNode.querySelector('.is-active');
    sib.classList.remove('is-active');
    sib.setAttribute('aria-selected', false);
    e.target.classList.add('is-active');
    e.target.setAttribute('aria-selected', true);
    let panels = Array.from(this.refs.tabContent.children);
    panels.forEach((panel) => {
      if(panel.id === e.target.getAttribute('href').replace('#', '')) {
        panel.classList.add('is-active');
      } else {
        panel.classList.remove('is-active');
      }
    });
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
    return result;
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
      children: Array.from(el.childNodes).reduce((prev, next) => {
        let i = prev.length;
        if(next.nodeType === 3 && next.textContent !== '') {
          var txt = next.textContent.replace(/[\t\r\n]/gm,'').replace(/\s{2,}/g, ' ');
          if(txt.match(/[\d\w]/g)) {
            let clist = Array.from(el.classList);
            clist.unshift(el.tagName.toLowerCase());
            prev.push({
              attributes: {_id: `${id}_children_${i}`, key: `${id}_children_${i}`},
              children: [],
              classList: [el.tagName.toLowerCase()].concat(Array.from(el.classList)), // text elements get parent elements tag and classList - just to differentiate text fields in edit mode.
              tag: '',
              textContent: txt
            });
          }
        } else if(next.nodeType === 1) {
          prev.push(this.getDomMap(next, `${id}_children_${i}`));
        }
        return prev;
      }, []),
      classList: Array.from(el.classList),
      tag: el.tagName.toLowerCase(),
      textContent: ''
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
    el.attributes.updateState = !this.renderingOutput ? (obj) => this.updateStateFromChild(obj) : null;
    var children = el.children.map((child) => this.createElement(child));
    if(el.tag === '') {
      return el.textContent;
    } else if(el.tag === 'a') {
      el.attributes.elements = this.state.elements;
    }
    return React.createElement(this.renderEditable(el.tag), el.attributes, this.renderChildren(el.tag) ? children : undefined);
  }
  render() {
    return (
      <div className="row">
        <div className="small-12 columns">
          <ul className="tabs" data-tabs id="example-tabs">
            <li className="tabs-title"><a className="is-active" href="#panel1" aria-selected="true" onClick={(e) => this.onTabClick(e)} ref="codeTab">&lt; /&gt;</a></li>
            <li className="tabs-title"><a href="#panel2" onClick={(e) => this.onTabClick(e)} ref="resultsTab">Results</a></li>
          </ul>
        </div>
        <div className="small-12 columns">
          <div className="row" ref="tabContent">
            <div className="small-12 columns tabs-panel is-active" id="panel1">
              <textarea
                ref="textarea"
                placeholder="Paste HTML Here"
                style={{display: 'block', width: '100%', height: '400px'}}
                onChange={(e) => this.onChange(e)}
                onKeyUp={(e) => this.onKeyUp(e)}
                onKeyDown={(e) => this.onKeyDown(e)}
              />
            </div>
            <div className="small-12 columns tabs-panel" id="panel2">
              {this.state.elements.map((el) => this.createElement(el))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MerchPack;
