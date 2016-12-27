import React, { Component } from 'react';
import _ from 'lodash';
import CarouselScroller from '../lib/carousel-scroller';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deltaX: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleScroll(pos) {
    this.setState({ deltaX: pos.deltaX });
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
          <CarouselScroller className="scroller">
            {_.range(1,10).map(nr => (
              <div key={nr} className="scroller-item">{nr}</div>
            ))}
          </CarouselScroller>
        </div>
      </div>
    );
  }
}

export default App;
