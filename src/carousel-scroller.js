import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import EasedScroller from './eased-scroller';

export const END = 'end';
export const START = 'start';

export default class CarouselScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrolling: false,
      x: 0,
      y: 0,
      initialPos: undefined,
    };
    this.el = {};
    this.bounds = {};
    this.setScrollerRef = this.setScrollerRef.bind(this);
    this.handleScrollStart = this.handleScrollStart.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleScrollEnd = this.handleScrollEnd.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.index !== this.props.index) {
      const pos = this.getPosFromIndex(nextProps.index);
      this.setState({ [this.props.orientation]: pos });
      this.conditionallyCallOnEnd(nextProps.index, this.props.index);
    }
    if (nextProps.orientation !== this.props.orientation) {
      // Transfer position
      this.setState({
        [nextProps.orientation]: this.state[this.props.orientation],
        [this.props.orientation]: 0,
      });
    }
  }

  conditionallyCallOnEnd(nextIndex, prevIndex) {
    if (typeof this.props.onEnd === 'function' && nextIndex !== prevIndex) {
      const lastReachableIndex = this.getLastReachableIndex();
      if (nextIndex >= lastReachableIndex) {
        this.props.onEnd(true, END)
      } else if (prevIndex >= lastReachableIndex) {
        this.props.onEnd(false, END);
      }
      if (nextIndex <= 0) {
        this.props.onEnd(true, START);
      } else if (prevIndex <= 0) {
        this.props.onEnd(false, START);
      }
    }
  }

  componentDidMount() {
    this.updateBounds();
    if (this.props.index !== 0) {
      const pos = this.getPosFromIndex(this.props.index);
      this.setState({ [this.props.orientation]: pos });
    }
  }

  componentWillUnmount() {
    this.el = {};
    this.bounds = {};
  }

  setScrollerRef(comp) {
    this.el = {
      scroller: comp.el,
      container: comp.el.parentElement,
    };
  }

  updateBounds() {
    if (this.el.scroller && this.el.container) {
      const children = this.el.scroller.children;
      this.bounds = {
        container: this.el.container.getBoundingClientRect(),
        scroller: this.el.scroller.getBoundingClientRect(),
        children: Array.from(children).map(child => child.getBoundingClientRect()),
      };
    }
  }

  handleScrollStart() {
    this.updateBounds();
    const orientation = this.props.orientation;
    this.setState({
      scrolling: true,
      initialPos: this.state[orientation],
    });
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
      scrolling: false,
      [orientation]: this.state.initialPos,
      initialPos: undefined,
    });
    if (typeof this.props.onChange === 'function') {
      const endIndex = this.getIndexFromPos(pos[orientation]);
      this.props.onChange(endIndex);
    }
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
    const childrenPos = this.bounds.children.reduce((arr, childBounds) => {
      const childPos = this.getPosFromChildBounds(childBounds);
      if (childPos !== min) arr.push(childPos);
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

  getIndexFromPos(pos) {
    const childrenPos = this.bounds.children.map(this.getPosFromChildBounds.bind(this));
    const childPos = this.getClosestVal(pos, childrenPos);
    return childrenPos.indexOf(childPos);
  }

  getPosFromIndex(index) {
    if (this.bounds.children) {
      const childIndex = _.clamp(index, 0, this.bounds.children.length - 1);
      return this.getPosFromChildBounds(this.bounds.children[childIndex]);
    }
    return 0;
  }

  getPosFromChildBounds(bounds) {
    const [min, max] = this.getMinMaxVal();
    const start = this.props.orientation === 'x' ? 'left' : 'top';
    const childPos = Math.round(max - (bounds[start] - this.bounds.scroller[start]));
    return childPos > min ? childPos : min;
  }

  getLastReachableIndex() {
    const [min] = this.getMinMaxVal();
    return this.getIndexFromPos(min);
  }

  getClassName() {
    const scrolling = this.state.scrolling;
    return classNames({ scrolling }, this.props.className);
  }

  getStyle() {
    const base = {
      position: 'absolute',
    };
    const whileScrolling = this.state.scrolling ? {
      userSelect: 'none',
    } : null;
    return Object.assign({},
      base,
      whileScrolling,
      this.props.style
    );
  }

  render() {
    const { x, y } = this.state;
    return React.createElement(EasedScroller, {
      x,
      y,
      orientation: this.props.orientation,
      className: this.getClassName(),
      ref: this.setScrollerRef,
      onScrollStart: this.handleScrollStart,
      onScroll: this.handleScroll,
      onScrollEnd: this.handleScrollEnd,
      style: this.getStyle(),
    }, this.props.children);
  }
}

CarouselScroller.propTypes = {
  orientation: PropTypes.oneOf(['x', 'y']),
  index: PropTypes.number,
  onChange: PropTypes.func,
  onEnd: PropTypes.func,
  withStyle: PropTypes.bool,
};

CarouselScroller.defaultProps = {
  orientation: 'x',
  index: 0,
};
