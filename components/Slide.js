import React, {Component} from 'react';
import Modal from 'react-modal';
import Toolbar from './Toolbar';

class Slide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      modalIsOpen: false,
    };
  }
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
  save(e) {
    e.preventDefault();
    const slides = this.props.slides.slice();
    slides.forEach((slide) => delete slide.img[0].src);
    slides[this.props.index] = {
      href: this.refs.href.value,
      className: this.refs.className.value.split(' '),
      img: [
        {
          'data-source': this.refs['data-source'].value,
          'data-mobile-source': this.refs['data-mobile-source'].value,
          alt: this.refs.alt.value
        }
      ],
      heading: [
        {text: this.refs.heading.value}
      ],
      section: [
        {text: this.refs.section.value}
      ]
    };

    this.props.updateState(
      {
        slides: slides
      }
    )
    this.toggleEditing(e);
  }
  toggleEditing(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      editing: !this.state.editing,
      modalIsOpen: !this.state.modalIsOpen,
    });
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
  renderItemOrEdit() {
    const customStyles = {
      content: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
        width: '50%',
        height: '50%'
      }
    };
    const slide = this.props.slides[this.props.index];
    slide.img[0].src = (this.props.showMobile) ? slide.img[0]['data-mobile-source'] : slide.img[0]['data-source'];
    if (this.state.editing) {
      return (
        <a href={slide.href} data-idx={this.props.index} className={`editable-item ${slide.className.join(' ')}`} onClick={(e) => e.preventDefault()} draggable={false}>
          <img data-idx={this.props.index} {...slide.img[0]} />
          <Modal isOpen={this.state.modalIsOpen} style={customStyles} >
            <div className="flex-it flex-wrap edit-box">
              <div className="flex-item-auto">
                <div  className="flex-it flex-col controls">
                  <label>
                    Link:
                    <input ref="href" defaultValue={slide.href} style={{width: '100%'}}/>
                  </label>
                  <label>
                    Alt Text:
                    <input ref="alt" defaultValue={slide.img[0].alt} style={{width: '100%'}}/>
                  </label>
                  <label>
                    Image Source:
                    <input ref="data-source" defaultValue={slide.img[0]['data-source']} style={{width: '100%'}}/>
                  </label>
                  <label>
                    Image Mobile Source:
                    <input ref="data-mobile-source" defaultValue={slide.img[0]['data-mobile-source'] || ''} style={{width: '100%'}}/>
                  </label>
                  <label>
                    Tab Text:
                    <input ref="heading" defaultValue={slide.heading[0].text} style={{width: '100%'}}/>
                  </label>
                  <label>
                    Teaser Text:
                    <input ref="section" defaultValue={slide.section[0].text} style={{width: '100%'}}/>
                  </label>
                  <input type="hidden" ref="className" defaultValue={slide.className.join(' ')}/>
                  <button className="saver button" onClick={(e) => this.save(e)}>Save</button>
                  <i title="Close" href="#close" className="edit-icon-link" onClick={(e) => this.toggleEditing(e)}>
                    <svg className="icon icon-edit"><use xlinkHref="#icon-cross"/></svg>
                  </i>
                </div>
              </div>
            </div>
          </Modal>
        </a>
      )
    } else {
      return (
        <a href={slide.href} data-idx={this.props.index} className={`editable-item ${slide.className.join(' ')}`} onClick={(e) => e.preventDefault()} draggable={true} onDragStart={(e) => this.dragStarted(e)} onDragOver={(e) => this.draggingOver(e)} onDragEnter={(e) => this.dragEnter(e)} onDragLeave={(e) => this.dragLeave(e)} onDrop={(e) => this.dropped(e)}>
          <img data-idx={this.props.index} {...slide.img[0]} />
          <section>{slide.section[0].text}</section>
          <h2>{slide.heading[0].text}</h2>
          {this.props.updateState && <Toolbar onClick={(e) => this.toggleEditing(e)}/>}
        </a>
      )
    }
  }
  render() {
    return this.renderItemOrEdit()
  }
}

Slide.propTypes = {
  updateState: React.PropTypes.func,
  index: React.PropTypes.number.isRequired,
  slides: React.PropTypes.array.isRequired
};

export default Slide;
