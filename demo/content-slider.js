import React, { Component } from 'react';

class Slider extends Component {
  constructor() {
    super();
    this.state = {
      slideNo: 0
    };

    this.toLeft = this.toLeft.bind(this);
    this.toRight = this.toRight.bind(this);
  }

  toRight() {
    const { children } = this.props;
    if (children.length > this.state.slideNo) {
      this.setState({
        slideNo: this.state.slideNo + 1
      });
    }
  }

  toLeft() {
    if (this.state.slideNo > 0) {
      this.setState({
        slideNo: this.state.slideNo - 1
      });
    }
  }

  render() {
    const { children } = this.props;

    return (
      <div className="slider">
        <h2>Slider</h2>
        <button onClick={this.toLeft}>Left</button>
        <button onClick={this.toRight}>Right</button>
        <ul>
        {
          children.map((child, idx) => {
            let style = {};

            if (idx === this.state.slideNo) {
              style.left = 0;
            }

            return <div key={idx} className="slide" style={style}>{child}</div>;
          })
        }
        </ul>
      </div>
    );
  }
}

export default Slider;
