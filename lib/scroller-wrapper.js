import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import requestAnimationFrame from 'requestanimationframe';
import Scroller from './scroller';

import './scroller.css';

const createTimestamp = typeof performance === "object" ?
  performance.now.bind(performance) : Date.now.bind(Date);

const transitionDuration = 300;

export default class ScrollerWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      scrolling: false,
    };
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  handleScrollStart() {
    this.setState({
      scrolling: true,
      timestamp: createTimestamp(),
      velocity: 0,
      acceleration: 1,
    });
  }

  handleScroll(pos) {
    const orientation = this.props.orientation;
    const timestamp = createTimestamp();
    const timeDelta = timestamp - this.state.timestamp;
    const lineDelta = pos[orientation] - this.state[orientation];
    const velocity = lineDelta / timeDelta; // px per millisecond
    const acceleration = (velocity - this.state.velocity) / Math.pow(timeDelta, 2);
    this.setState({
      [orientation]: this.correctNextPos(pos[orientation]),
      direction: Math.sign(lineDelta),
      timestamp,
      velocity,
      acceleration,
    });
  }

  handleScrollEnd() {
    this.setState({ scrolling: false });
    const orientation = this.props.orientation;
    const endPos = this.calcPosAoT();
    requestAnimationFrame(() => {
      this.setState({ [orientation]: this.correctNextPos(endPos) });
    });
  }

  calcPosAoT() {
    const orientation = this.props.orientation;
    const currentPos = this.state[orientation];
    const direction = this.state.direction;
    const acceleration = this.state.acceleration;
    const distance = 0.5 * Math.abs(acceleration) * Math.pow(transitionDuration, 2);
    return currentPos + (direction * distance);
  }

  correctNextPos(nextPos) {
    return nextPos;
  }

  getClassName() {
    const scrolling = this.state.scrolling;
    return classNames('react-scroller', { scrolling }, this.props.className);
  }

  getRenderProps() {
    const orientation = this.props.orientation;
    return Object.assign({}, this.props, {
      className: this.getClassName(),
      onScrollStart: this.handleScrollStart,
      onScroll: this.handleScroll,
      onScrollEnd: this.handleScrollEnd,
      [orientation]: this.state[orientation],
    });
  }

  render() {
    return React.createElement(Scroller, this.getRenderProps(), this.props.children);
  }
}

ScrollerWrapper.propTypes = {
  orientation: PropTypes.oneOf(['x', 'y']),
};

ScrollerWrapper.defaultProps = {
  orientation: 'x',
};