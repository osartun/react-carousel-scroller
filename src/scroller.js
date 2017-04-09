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
  }

  setElRef(el) {
    this.el = el;
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

    if (typeof this.props.onScrollStart === 'function') {
      this.props.onScrollStart({
        x: this.props.x,
        y: this.props.y,
      }, e);
    }
  }

  handleScrollMove(e) {
    if (e.touches && e.touches.length > 1) return;

    const { pageX, pageY } = (e.touches && e.touches[0]) || e;

    if (typeof this.props.onScroll === 'function') {
      this.props.onScroll({
        x: this.state.startRelX + pageX - this.state.startAbsX,
        y: this.state.startRelY + pageY - this.state.startAbsY,
      }, e);
    }
  }

  handleScrollEnd(e) {
    const doc = this.el.ownerDocument;
    doc.removeEventListener('touchmove', this.handleScrollMove);
    doc.removeEventListener('mousemove', this.handleScrollMove);
    doc.removeEventListener('touchend', this.handleScrollEnd, true);
    doc.removeEventListener('mouseup', this.handleScrollEnd, true);

    if (typeof this.props.onScrollEnd === 'function') {
      this.props.onScrollEnd({
        x: this.props.x,
        y: this.props.y,
      }, e);
    }
  }

  renderStyle() {
    const { x, y } = this.props;
    return Object.assign({
      transform: `translate(${x}px, ${y}px)`,
    }, this.props.style);
  }

  render() {
    const props = _.omit(this.props, ['tagName', 'x', 'y', 'onScrollStart', 'onScroll', 'onScrollEnd']);

    return React.createElement(this.props.tagName, Object.assign({}, props,
      {
        ref: this.setWrapperRef,
        onTouchStart: this.handleScrollStart,
        onMouseDown: this.handleScrollStart,
        style: this.renderStyle(),
      }), this.props.children);
  }
}

Scroller.propTypes = {
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Component)]),
  children: PropTypes.node,
  onScrollStart: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollEnd: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
};

Scroller.defaultProps = {
  tagName: 'div',
  x: 0,
  y: 0,
  style: null,
};