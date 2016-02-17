import React, {Component} from 'react';


class Slide extends Component {
  updateState(e) {
    e.preventDefault();
    const slides = this.props.slides.slice();
    const slide = slides[0];
    delete slide.img[0].src;
    slides.push(slide);
    slides.shift();
    this.props.updateState(
      {
        slides: slides
      }
    )
  }

  dragStarted(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.idx);
    e.dataTransfer.effectAllowed = "move";
  }
  dragEnter(e){
    e.preventDefault();
    e.target.parentNode.classList.add('dragging-over');
    e.dataTransfer.dropEffect = "move";
  }
  dragLeave(e){
    e.preventDefault();
    e.target.parentNode.classList.remove('dragging-over');
    e.dataTransfer.dropEffect = "move";
  }
  draggingOver(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }
  dropped(e){
    e.preventDefault();
    e.stopPropagation();
    const slides = this.props.slides.slice();
    const idx = e.target.dataset.idx;
    var tmp = slides[e.dataTransfer.getData("text/plain")];
    slides[e.dataTransfer.getData("text/plain")] = slides[idx];
    slides[idx] = tmp;
    slides.forEach((slide) => delete slide.img[0].src);
    this.props.updateState(
      {
        slides: slides
      }
    );
    e.target.parentNode.classList.remove('dragging-over');
  }
  render() {
    const slide = this.props.slides[this.props.index];
    //if(this.props.index === 0) {
      slide.img[0].src = slide.img[0]['data-source'];
    //}
    return (
      <a href={slide.href} data-idx={this.props.index} className={slide.className.join(' ')} draggable={true} onDragStart={(e) => this.dragStarted(e)} onDragOver={(e) => this.draggingOver(e)} onDragEnter={(e) => this.dragEnter(e)} onDragLeave={(e) => this.dragLeave(e)} onDrop={(e) => this.dropped(e)}>
        <img data-idx={this.props.index} {...slide.img[0]} />
        <section>{slide.section[0].text}</section>
        <h2>{slide.header[0].text}</h2>
      </a>
    )
  }
}

Slide.propTypes = {
  updateState: React.PropTypes.func,
  index: React.PropTypes.number.isRequired,
  slides: React.PropTypes.array.isRequired
};

export default Slide;
