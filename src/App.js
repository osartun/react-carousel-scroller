import React, { Component } from 'react';
import ScrollerWrapper from '../lib/scroller-wrapper';
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
        <ScrollerWrapper className="scroller">
          Foobar
        </ScrollerWrapper>
      </div>
    );
  }
}

export default App;
