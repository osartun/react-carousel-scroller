import React, { Component } from 'react';
import OptionInput from './option-input';

export default class Showcase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        nrOfItems: 50,
        orientation: 'y',
        index: 0
      }
    };
    this.onChangeOption = this.onChangeOption.bind(this);
  }

  onChangeOption(options) {
    this.setState({ options });
  }

  render() {
    return (
      <OptionInput
        {...this.state.options}
        onChange={this.onChangeOption}
      />
    );
  }
}
