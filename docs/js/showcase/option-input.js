import React, { Component } from 'react';

const labelFor = name => `option-input-${name}`;

export default class OptionInput extends Component {
  constructor(props) {
    super(props);
    this.onChangeItemNr = this.onChangeItemNr.bind(this);
    this.onChangeOrientation = this.onChangeOrientation.bind(this);
    this.onChangeIndex = this.onChangeIndex.bind(this);
  }

  onChangeItemNr(e) {
    this.props.onChange({
      ...this.props,
      nrOfItems: e.target.value
    });
  }

  onChangeOrientation(e) {
    this.props.onChange({
      ...this.props,
      orientation: e.target.value
    });
  }

  onChangeIndex(e) {
    this.props.onChange({
      ...this.props,
      index: e.target.index
    });
  }

  render() {
    return (
      <fieldset>
        <div>
          <label htmlFor={labelFor('nrOfItems')}>Nr. of items</label>
          <input
            id={labelFor('nrOfItems')}
            type="number"
            value={this.props.nrOfItems}
            onChange={this.onChangeItemNr}
          />
        </div>
        <div>
          <label htmlFor={labelFor('orientation')}>Orientation</label>
          <select
            id={labelFor('orientation')}
            value={this.props.orientation}
            onChange={this.onChangeOrientation}
          >
            <option value="x">Horizontal</option>
            <option value="y">Vertical</option>
          </select>
        </div>
        <div>
          <label htmlFor={labelFor('index')}>Index</label>
          <input
            id={labelFor('index')}
            type="number"
            min={0}
            max={this.props.nrOfItems}
            value={this.props.index}
            onChange={this.onChangeIndex}
          />
        </div>
      </fieldset>
    );
  }
}
