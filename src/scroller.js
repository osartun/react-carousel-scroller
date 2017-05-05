import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Scroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startAbsX: 0,
      startAbsY: 0,
      startRelX: 0,
      startRelY: 0,
    };
    this.el = null;
    this.setWrapperRef = this.setElRef.bind(this);
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScrollMove = this.handleScrollMove.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
  }

  setElRef(el) {
    this.el = el;
  }

  callHandler(name, ...args) {
    if (_.isFunction(this.props[name])) {
      this.props[name](...args);
    }
  }

  handleScrollStart(e) {
    const { pageX, pageY } = (e.touches && e.touches[0]) || e;

    this.setState({
      startAbsX: pageX,
      startAbsY: pageY,
      startRelX: this.props.x,
      startRelY: this.props.y,
    });

    const doc = this.el.ownerDocument;
    doc.addEventListener('touchmove', this.handleScrollMove);
    doc.addEventListener('mousemove', this.handleScrollMove);
    doc.addEventListener('touchend', this.handleScrollEnd, true);
    doc.addEventListener('mouseup', this.handleScrollEnd, true);

    this.callHandler('onScrollStart', {
      x: this.props.x,
      y: this.props.y,
    }, e);
  }

  handleScrollMove(e) {
    if (e.touches && e.touches.length > 1) return;

    const { pageX, pageY } = (e.touches && e.touches[0]) || e;

    this.callHandler('onScroll', {
      x: this.state.startRelX + pageX - this.state.startAbsX,
      y: this.state.startRelY + pageY - this.state.startAbsY,
    }, e);
  }

  handleScrollEnd(e) {
    const doc = this.el.ownerDocument;
    doc.removeEventListener('touchmove', this.handleScrollMove);
    doc.removeEventListener('mousemove', this.handleScrollMove);
    doc.removeEventListener('touchend', this.handleScrollEnd, true);
    doc.removeEventListener('mouseup', this.handleScrollEnd, true);

    this.callHandler('onScrollEnd', {
      x: this.props.x,
      y: this.props.y,
    }, e);
  }

  determineWheelEnd() {
    if (this._wheelEndTimerId !== undefined) {
      clearTimeout(this._wheelEndTimerId);
    }
    this._wheelEndTimerId = setTimeout(() => {
      delete this._wheelEndTimerId;
      this.handleWheelEnd();
    }, this.props.wheelEndDelay);
  }

  handleWheel(e) {
    if (this.props.disableOnWheel) return;
    e.preventDefault();

    if (this._wheelEndTimerId === undefined) {
      // So far, not wheeling, so let's start with it
      this.handleWheelStart(e);
    } else {
      this.handleWheelMove(e);
    }
    // Set a timeout to determine the wheeling's end
    this.determineWheelEnd();
  }

  handleWheelStart(e) {
    this.callHandler('onScrollStart', {
      x: this.props.x,
      y: this.props.y,
    }, e);
  }

  handleWheelMove(e) {
    this.callHandler('onScroll', {
      x: this.props.x - e.deltaX,
      y: this.props.y - e.deltaY,
    }, e);
  }

  handleWheelEnd() {
    this.callHandler('onScrollEnd', {
      x: this.props.x,
      y: this.props.y,
    });
  }

  renderStyle() {
    const { x, y } = this.props;
    return Object.assign({
      transform: `translate(${x}px, ${y}px)`,
    }, this.props.style);
  }

  render() {
    const props = _.omit(this.props, ['tagName', 'x', 'y', 'onScrollStart',
      'onScroll', 'onScrollEnd', 'disableOnWheel', 'wheelEndDelay']);

    return React.createElement(this.props.tagName, Object.assign({}, props,
      {
        ref: this.setWrapperRef,
        onTouchStart: this.handleScrollStart,
        onMouseDown: this.handleScrollStart,
        onWheel: this.handleWheel,
        style: this.renderStyle(),
      }), this.props.children);
  }
}

Scroller.propTypes = {
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.node,
  onScrollStart: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollEnd: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
  disableOnWheel: PropTypes.bool,
  wheelEndDelay: PropTypes.number,
};

Scroller.defaultProps = {
  tagName: 'div',
  x: 0,
  y: 0,
  style: null,
  wheelEndDelay: 100,
};
