import React, {Component} from 'react';

class Home extends Component{
  onChange(e) {
    this.refs.target.innerHTML = e.target.value;

    let el = document.createElement('div');
    el.innerHTML = e.target.value;
    console.log(Array.from(el.children).map((e) => this.getDomMap(e)));
  }
  getDomMap(el) {
    return {
      attributes: Array.from(el.attributes)
        .reduce((prev, next) => {
          if(next.nodeName === 'class' || next.nodeName.match(/^data-/)){
            return prev;
          }
          prev[next.nodeName] = next.nodeValue;
          return prev;
        }, {}),
      children: Array.from(el.children).map((child) => this.getDomMap(child)),
      classList: Array.from(el.classList),
      dataset: Array.from(el.attributes)
        .reduce((prev, next) => {
          if(!next.nodeName.match(/^data-/)){
            return prev;
          }
          prev[next.nodeName.replace(/data-/, '')] = next.nodeValue;
          return prev;
        }, {}),
      nodeName: el.nodeName,
      textContent: Array.from(el.childNodes).reduce((prev, next) => {
        if(next.nodeType === 3 && next.textContent.replace(/(\r\n|\n|\r|\t)/gm,'').replace(/\s{2,}/g, ' ') !== '') {
          prev += next.textContent.replace(/(\r\n|\n|\r|\t)/gm,'').replace(/\s{2,}/g, ' ');
        }
        return prev;
      }, '')
    }
  }
  render() {
    return (
      <div>
        <textarea style={{display: 'block', width: '960px', height: '400px', margin: '0 auto'}} onChange={(e) => this.onChange(e)}/>
        <div ref="target" className="main_content homepage"></div>
      </div>
    )
  }
};

export default Home;
