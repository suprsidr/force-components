import React, {Component} from 'react';

import Slide from './Slide';

class Slides extends Component {
  render() {
    return (
      <div id="slider" className="nivoSlider home_mainGlam">
        {this.props.slides.map((slide, i) => (
          <Slide
            {...this.props}
            index={i}
            key={i} />
        ))}
      </div>
    )
  }
}

Slides.propTypes = {
  updateState: React.PropTypes.func,
  slides: React.PropTypes.array.isRequired
};
export default Slides;
