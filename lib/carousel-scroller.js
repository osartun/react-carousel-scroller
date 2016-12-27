import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import EasedScroller from './eased-scroller';

export default class CarouselScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolling: false,
      x: 0,
      y: 0,
    };
    this.el = {};
    this.bounds = {};
    this.setContainerRef = this.setContainerRef.bind(this);
    this.setScrollerRef = this.setScrollerRef.bind(this);
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  setContainerRef(el) {
    this.el.container = el;
  }

  setScrollerRef(comp) {
    this.el.scroller = comp.el;
  }

  handleScrollStart() {
    const children = this.el.scroller.children;
    this.bounds = {
      container: this.el.container.getBoundingClientRect(),
      scroller: this.el.scroller.getBoundingClientRect(),
      children: Array.from(children).map(child => child.getBoundingClientRect()),
    };
    this.setState({ scrolling: true });
  }

  handleScroll(pos) {
    const orientation = this.props.orientation;
    const [min, max] = this.getMinMaxVal();
    this.setState({
      [orientation]: _.clamp(pos[orientation], min, max),
    });
  }

  handleScrollEnd(pos) {
    const orientation = this.props.orientation;
    const [min, max] = this.getMinMaxVal();
    this.setState({
      [orientation]: _.clamp(pos[orientation], min, max),
      scrolling: false,
    });
  }

  getMinMaxVal() {
    const [start, end, length] = this.props.orientation === 'x' ? ['left', 'right', 'width'] : ['top', 'bottom', 'height'];
    const { scroller, container } = this.bounds;
    return scroller[length] <= container[length] ?
      [0, container[end] - scroller[length] - container[start]] :
      [container[end] - scroller[length] - container[start], 0];
  }

  getClassName() {
    const scrolling = this.state.scrolling;
    return classNames({ scrolling }, this.props.className);
  }

  render() {
    const props = _.omit(this.props, ['children', 'onScrollStart', 'onScroll', 'onScrollEnd', 'x', 'y']);
    return (
      <div ref={this.setContainerRef}>
        <EasedScroller
          {...props}
          className={this.getClassName()}
          x={this.state.x}
          y={this.state.y}
          ref={this.setScrollerRef}
          onScrollStart={this.handleScrollStart}
          onScroll={this.handleScroll}
          onScrollEnd={this.handleScrollEnd}
        >
          {this.props.children}
        </EasedScroller>
      </div>
    );
  }
}

CarouselScroller.propTypes = Object.assign({}, EasedScroller.propTypes, {
  orientation: EasedScroller.propTypes.orientation,
});

CarouselScroller.defaultProps = {
  orientation: 'x',
};