import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CarouselScroller from '../src/carousel-scroller';
import css from './style.css';

export default class DemoScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(index) {
    this.setState({ index });
  }

  render() {
    return (
      <div className={css.wrapper}>
        <CarouselScroller
          className={css.scroller}
          index={this.state.index}
          onChange={this.onChange}
        >
          {_.times(50).map((e, i) => (
            <div key={i} className={css.item}>{i}</div>
          ))}
        </CarouselScroller>
      </div>
    );
  }
}
