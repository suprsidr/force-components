import React from 'react'
import OutputSlide from './OutputSlide';

class OutputTemplate extends React.Component {
  constructor (props) {
    super(props);
    this.state = this.props.currentState;
  }

  render() {
    return (
      <i>
        {this.props.slides.map((slide, i) => (
          <OutputSlide
            {...this.props}
            index={i}
            key={i} />
        ))}
      </i>
    )
  }
}


export default OutputTemplate
