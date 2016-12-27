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
    this.setState({
      [orientation]: this.getLatchPos(pos[orientation]),
      scrolling: false,
    });
  }

  getMinMaxVal() {
    const length = this.props.orientation === 'x' ? 'width' : 'height';
    const { scroller, container } = this.bounds;
    const lastChild = _.last(this.bounds.children);
    if (scroller[length] > container[length]) {
      return [container[length] - scroller[length], 0];
    } else if (!lastChild) {
      return [0, 0];
    }
    return [lastChild[length] - scroller[length], 0];
  }

  getLatchPos(pos) {
    const [min, max] = this.getMinMaxVal();
    const start = this.props.orientation === 'x' ? 'left' : 'top';
    const childrenPos = this.bounds.children.reduce((arr, childBounds) => {
      const childPos = Math.round(max - (childBounds[start] - this.bounds.scroller[start]));
      if (childPos > min) arr.push(childPos);
      return arr;
    }, []);
    return this.getClosestVal(pos, [].concat([max], childrenPos, [min]));
  }

  getClosestVal(nr, range = []) {
    let curr = range[0];
    range.forEach(val => {
      if (Math.abs(nr - val) < Math.abs(nr - curr)) curr = val;
    });
    return curr;
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