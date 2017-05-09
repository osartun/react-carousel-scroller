import React from 'react';
import ReactDOM from 'react-dom';
import CarouselScroller from 'react-carousel-scroller';

class TestScroller extends React.Component {
  render() {
    return React.createElement("div", null, "Yo!!");
  }
}

ReactDOM.render(
  React.createElement(TestScroller, { foo: 'bar' }),
  document.getElementById('foobar')
)
