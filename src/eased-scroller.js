import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import raf from 'raf';
import Scroller from './scroller';

const createTimestamp = typeof performance === "object" ?
  performance.now.bind(performance) : Date.now.bind(Date);

export default class EasedScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolling: false,
      ending: false,
      style: null,
      direction: 0,
      timestamp: createTimestamp(),
      velocity: 0,
      acceleration: 0,
    };
    this.el = null;
    this.rafId = 0;
    this.setRefEl = this.setRefEl.bind(this);
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const orientation = this.props.orientation;
    if (nextProps[orientation] !== this.props[orientation] &&
      !this.state.scrolling && !this.state.ending) {
      this.setState({ style: this.getStyle() });
    }
  }

  componentWillUnmount() {
    if (this.rafId) {
      raf.cancel(this.rafId);
      this.rafId = 0;
    }
  }

  setRefEl(comp) {
    this.el = comp ? comp.el : null;
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

  handleScroll(pos, e) {
    const orientation = this.props.orientation;
    const timestamp = createTimestamp();
    const timeDelta = timestamp - this.state.timestamp;
    const lineDelta = pos[orientation] - this.props[orientation];
    const velocity = lineDelta / timeDelta; // px per millisecond
    const acceleration = (velocity - this.state.velocity) / Math.pow(timeDelta, 2);
    const direction = Math.sign(lineDelta);
    this.setState({
      direction,
      timestamp,
      velocity,
      acceleration,
    });
    if (typeof this.props.onScroll === 'function') {
      this.props.onScroll(Object.assign({}, pos, {
        [orientation]: pos[orientation],
        direction,
        velocity,
        acceleration,
      }), e);
    }
  }

  handleScrollEnd(pos, e) {
    this.setState({ scrolling: false, ending: true });
    const orientation = this.props.orientation;
    const endPos = this.calcPosAoT();
    this.setState({ style: this.getStyle() });
    this.rafId = raf(() => {
      this.rafId = 0;
      if (typeof this.props.onScrollEnd === 'function') {
        const { direction, velocity, acceleration } = this.state;
        this.props.onScrollEnd(Object.assign({}, pos, {
          [orientation]: endPos,
          direction,
          velocity,
          acceleration,
        }), e);
      }
      this.setState({ ending: false });
    });
  }

  calcPosAoT() {
    const orientation = this.props.orientation;
    const currentPos = this.props[orientation];
    const direction = this.state.direction;
    const acceleration = this.state.acceleration;
    if (acceleration === 1) return currentPos;
    const distance = 0.5 * Math.abs(acceleration) * Math.pow(this.props.easeDuration, 2);
    return currentPos + (direction * distance);
  }

  getStyle() {
    return {
      transition: `transform ${this.props.easeDuration}ms ease-out`,
    };
  }

  renderStyle() {
    return Object.assign({}, this.state.style, this.props.style);
  }

  getRenderProps() {
    const props = _.omit(this.props, ['orientation', 'easeDuration']);
    return Object.assign({}, props, {
      ref: this.setRefEl,
      onScrollStart: this.handleScrollStart,
      onScroll: this.handleScroll,
      onScrollEnd: this.handleScrollEnd,
      style: this.renderStyle(),
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
