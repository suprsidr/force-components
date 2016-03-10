import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import request from 'superagent';
import OutputSlide from './OutputSlide';
import html from 'html';

import Slides from './Slides';

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slides: [],
      showMobile: false
    };
    //this.stateLog = [{time: this.getTimeStamp(), state: this.state.slides}];
  }
  componentDidMount() {
    request
      .get('/slides')
      .end((err, res) => {
        err ? console.log(err) : '';//console.log(res);
        this.setState( {
          slides: this.getElements(res.text)
        });
      });
  }
  updateState(obj, cb) {
    this.setState(obj, () => {
      cb && cb();
      console.log(this.state);
    });
  }
  getDangerousHtml() {
    var result = '';
    this.state.slides.forEach((slide, i) => {
      result += html.prettyPrint(ReactDOMServer.renderToStaticMarkup(React.createElement(OutputSlide, {slides: this.state.slides, index: i})));
      result += '\n';
      result += '\n';
    })
    return result.replace(/&amp;/g, '&'); //html.prettyPrint(ReactDOMServer.renderToStaticMarkup(React.createElement(OutputTemplate, {slides: this.state.slides})).replace('<i>', '').replace('</i>', ''));
  }
  getElements(html) {
    let element = document.createElement('div');
    element.innerHTML = html;
    const anchors = Array.from(element.querySelectorAll('a')).map((a) => (
      {
        href: a.getAttribute("href").trim(), // literal path
        className: Array.from(a.classList),
        img: Array.from(a.querySelectorAll('img')).map((img) => (
        {
          alt: img.alt || null,
          'data-source': img.dataset.source || null,
          'data-mobile-source': img.dataset.mobileSource || 'http://placehold.it/640x480?text=Missing+Mobile+Image'
        }
        )),
        section: Array.from(a.querySelectorAll('section')).map((section) => ({text: section.textContent})),
        heading: Array.from(a.querySelectorAll('h2')).map((header) => ({text: header.textContent}))
      }
    ));

    //console.log(anchors);

    return anchors;
  }
  toggleShowMobile(e) {
    e.preventDefault();
    this.setState({
      showMobile: !this.state.showMobile
    });
  }
  render() {
    return (
      <div id="app" className="row">
        <div className="small-12 columns">
          <button className="button" onClick={(e) => this.toggleShowMobile(e)}>Toggle Mobile</button>
        </div>
        <div className="small-12 columns">
          <Slides slides={this.state.slides} updateState={(obj) => this.updateState(obj)} showMobile={this.state.showMobile}/>
        </div>
        <div className="small-12 columns">
          <textarea value={this.getDangerousHtml()}/>
        </div>
      </div>
    )
  }
}

export default  Content;
