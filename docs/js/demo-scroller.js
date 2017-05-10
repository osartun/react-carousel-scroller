import _ from 'lodash';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CarouselScroller from './src/carousel-scroller';

const itemCss = {
  display: 'inline-block',
  width: '100px',
  height: '100px',
  backgroundColor: 'blue',
  marginRight: '10px'
};

const wrapperCss = {
  position: 'relative',
  width: '640px',
  height: '100px',
  overflow: 'hidden'
};

export default class DemoScroller extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(index) {
    console.log(index);
    this.setState({ index });
  }

  render() {
    return (
      <div style={wrapperCss}>
        <CarouselScroller
          index={this.state.index}
          onChange={this.onChange}
        >
          {_.times(50).map((e, i) => (
            <div key={i} style={itemCss} />
          ))}
        </CarouselScroller>
      </div>
    );
  }
}
