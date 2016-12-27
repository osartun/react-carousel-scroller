import React, { Component } from 'react';
import _ from 'lodash';
import EasedScroller from './eased-scroller';

export default class ScrollerContainer extends Component {
  constructor(props) {
    super(props);
    this.el = {};
    this.setScrollerRef = this.setScrollerRef.bind(this);
  }

  setScrollerRef(comp) {
    if (comp && comp.el && comp.el.wrapper) {
      this.el.scroller = comp.el.wrapper;
      this.el.scrollerParent = comp.el.wrapper.parentElement;
    }
  }

  correctNextPos(nextPos) {
    if (this.el.scroller) {
      const scrollerBounds = this.el.scroller.getBoundingClientRect();
      const containerBounds = this.el.scrollerParent.getBoundingClientRect();
      const [start, end, length] = this.props.orientation === 'x' ? ['left', 'right', 'width'] : ['top', 'bottom', 'height'];
      const startPos = containerBounds[start];
      if (scrollerBounds[length] <= containerBounds[length]) {
        return _.clamp(nextPos, 0, containerBounds[end] - scrollerBounds[length] - startPos);
      } else {
        return _.clamp(nextPos, containerBounds[end] - scrollerBounds[length] - startPos, 0);
      }
    }
    return nextPos;
  }

  getRenderProps() {
    return Object.assign(super.getRenderProps(), {
      ref: this.setScrollerRef,
    });
  }
}