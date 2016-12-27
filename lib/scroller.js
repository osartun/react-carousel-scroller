import React, { Component, PropTypes } from 'react';
import _ from 'lodash';

export default class Scroller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
    };
    this.el = {};
    this.setWrapperRef = this.setElRef.bind(this, 'wrapper');
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScrollMove = this.handleScrollMove.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  setElRef(name, el) {
    this.el[name] = el;
  }

  handleScrollStart(e) {
    const { pageX, pageY } = (e.touches && e.touches[0]) || e;

    this.setState({
      startX: pageX,
      startY: pageY,
    });

    const doc = this.el.wrapper.ownerDocument;
    doc.addEventListener('touchmove', this.handleScrollMove);
    doc.addEventListener('mousemove', this.handleScrollMove);
    doc.addEventListener('touchend', this.handleScrollEnd, true);
    doc.addEventListener('mouseup', this.handleScrollEnd, true);

    if (typeof this.props.onScrollStart === 'function') {
      this.props.onScrollStart({
        x: this.state.endX,
        y: this.state.endY,
      }, e);
    }
  }

  handleScrollMove(e) {
    if (e.touches && e.touches.length > 1) return;

    const { pageX, pageY } = (e.touches && e.touches[0]) || e;

    if (typeof this.props.onScroll === 'function') {
      this.props.onScroll({
        x: this.state.endX + pageX - this.state.startX,
        y: this.state.endY + pageY - this.state.startY,
      }, e);
    }
  }

  handleScrollEnd(e) {
    this.setState({
      startX: 0,
      startY: 0,
      endX: this.props.x,
      endY: this.props.y,
    });

    const doc = this.el.wrapper.ownerDocument;
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