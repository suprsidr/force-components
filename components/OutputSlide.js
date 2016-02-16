import React, {Component} from 'react';


class OutputSlide extends Component {
  render() {
    const slide = this.props.slides[this.props.index];
    if(this.props.index === 0) {
      slide.img[0].src = slide.img[0]['data-source'];
    }
    return (
      <a href={slide.href} className={slide.className.join(' ')}>
        <img {...slide.img[0]} />
        <section>{slide.section[0].text}</section>
        <h2>{slide.header[0].text}</h2>
      </a>
    )
  }
}

export default OutputSlide;
