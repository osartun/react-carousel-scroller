import React, { Component, PropTypes } from 'react';
import requestAnimationFrame from 'requestanimationframe';
import Scroller from './scroller';

const createTimestamp = typeof performance === "object" ?
  performance.now.bind(performance) : Date.now.bind(Date);

export default class EasedScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolling: false,
      style: null,
      direction: 0,
      timestamp: createTimestamp(),
      velocity: 0,
      acceleration: 0,
    };
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  handleScrollStart(pos, e) {
    this.setState({
      scrolling: true,
      style: null,
      timestamp: createTimestamp(),
      velocity: 0,
      acceleration: 1,
    });
    if (typeof this.props.onScrollStart === 'function') {
      this.props.onScrollStart(pos, e);
    }
  }

  handleScroll(pos) {
    const orientation = this.props.orientation;
    const timestamp = createTimestamp();
    const timeDelta = timestamp - this.state.timestamp;
    const lineDelta = pos[orientation] - this.props[orientation];
    const velocity = lineDelta / timeDelta; // px per millisecond
    const acceleration = (velocity - this.state.velocity) / Math.pow(timeDelta, 2);
    this.setState({
      direction: Math.sign(lineDelta),
      timestamp,
      velocity,
      acceleration,
    });
    if (typeof this.props.onScroll === 'function') {
      this.props.onScroll(Object.assign({}, pos, { [orientation]: pos[orientation] }), e);
    }
  }

  handleScrollEnd(pos, e) {
    this.setState({ scrolling: false });
    const orientation = this.props.orientation;
    const endPos = this.calcPosAoT();
    this.setState({ style: this.getStyle() });
    requestAnimationFrame(() => {
      if (typeof this.props.onScrollEnd === 'function') {
        this.props.onScrollEnd(Object.assign({}, pos, { [orientation]: endPos }), e);
      }
    });
  }

  calcPosAoT() {
    const orientation = this.props.orientation;
    const currentPos = this.props[orientation];
    const direction = this.state.direction;
    const acceleration = this.state.acceleration;
    const distance = 0.5 * Math.abs(acceleration) * Math.pow(this.props.easeDuration, 2);
    return currentPos + (direction * distance);
  }

  getStyle() {
    return {
      transition: `transform ${this.props.easeDuration}ms 0 ease-out`,
    };
  }

  getRenderProps() {
    const orientation = this.props.orientation;
    return Object.assign({}, this.props, {
      onScrollStart: this.handleScrollStart,
      onScroll: this.handleScroll,
      onScrollEnd: this.handleScrollEnd,
      style: this.state.style,
    });
  }

  render() {
    return React.createElement(Scroller, this.getRenderProps(), this.props.children);
  }
}

EasedScroller.propTypes = Object.assign({}, Scroller.propTypes, {
  orientation: PropTypes.oneOf(['x', 'y']),
  easeDuration: PropTypes.number,
});

EasedScroller.defaultProps = {
  orientation: 'x',
  easeDuration: 300,
};