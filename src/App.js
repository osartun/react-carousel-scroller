import React, { Component } from 'react';
import _ from 'lodash';
import CarouselScroller, { START, END } from '../lib/carousel-scroller';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      end: 'start',
    };
    this.next = this.setIndex.bind(this, 1);
    this.prev = this.setIndex.bind(this, -1);
    this.onChange = this.onChange.bind(this);
    this.onEnd = this.onEnd.bind(this);
  }

  setIndex(dir) {
    this.setState({
      index: this.state.index + dir,
    });
  }

  onChange(index) {
    this.setState({ index, end: '' });
  }

  onEnd(isAtEnd, whichEnd) {
    this.setState({ end: isAtEnd ? whichEnd : '' });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="container">
          <CarouselScroller
            index={this.state.index}
            onChange={this.onChange}
            onEnd={this.onEnd}
            className="scroller"
          >
            {_.range(1, 10).map(nr => (
              <div key={nr} className="scroller-item">{nr}</div>
            ))}
          </CarouselScroller>
        </div>
        <div className="container">
          <CarouselScroller
            index={this.state.index}
            onChange={this.onChange}
            className="scroller"
          >
            {_.range(1, 4).map(nr => (
              <div key={nr} className="scroller-item">{nr}</div>
            ))}
          </CarouselScroller>
        </div>
        <div className="container">
          <CarouselScroller
            index={3}
            onChange={this.onChange}
            onEnd={this.onEnd}
            className="scroller"
          >
            {_.range(1, 10).map(nr => (
              <div key={nr} className="scroller-item">{nr}</div>
            ))}
          </CarouselScroller>
        </div>
        <div className="container">
          <CarouselScroller
            index={this.state.index}
            onChange={this.onChange}
            className="scroller"
          >
            {_.range(1, 10).map(nr => (
              <div key={nr} className="scroller-item-2">{nr}</div>
            ))}
          </CarouselScroller>
        </div>
        <div className="container-vertical">
          <CarouselScroller
            index={this.state.index}
            onChange={this.onChange}
            className="scroller"
            orientation="y"
          >
            {_.range(1, 10).map(nr => (
              <div key={nr} className="scroller-item-3">{nr}</div>
            ))}
          </CarouselScroller>
        </div>
        <button onClick={this.prev} disabled={this.state.end === START}>Prev</button>
        <button onClick={this.next} disabled={this.state.end === END}>Next</button>
      </div>
    );
  }
}

export default App;
