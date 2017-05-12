import React, { Component } from 'react';
import OptionInput from './option-input';
import ShowcaseScroller from './showcase-scroller';
import CodeOutput from './code-output';

export default class Showcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nrOfItems: 50,
      orientation: 'x',
      index: 0,
      isDiffSize: false,
      listener: 'basic'
    };
    this.onChangeOption = this.onChangeOption.bind(this);
    this.onSlideBasic = this.onSlideBasic.bind(this);
  }

  getChangeListener() {
    if (this.state.listener === 'basic') {
      return this.onSlideBasic;
    }
  }

  onChangeOption(options) {
    this.setState(options);
  }

  onSlideBasic(index) {
    this.setState({ index });
  }

  render() {
    return (
      <div>
        <OptionInput
          {...this.state}
          onChange={this.onChangeOption}
        />
        <ShowcaseScroller
          {...this.state}
          onChange={this.getChangeListener()}
        />
        <CodeOutput {...this.state} />
      </div>
    );
  }
}
