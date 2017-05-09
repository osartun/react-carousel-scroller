import React from 'react';
import ReactDOM from 'react-dom';
import CarouselScroller from 'react-carousel-scroller';

const TestScroller = () => (
  <div>Now with babel configuration</div>
);

ReactDOM.render(
  React.createElement(TestScroller, { foo: 'bar' }),
  document.getElementById('foobar')
)
