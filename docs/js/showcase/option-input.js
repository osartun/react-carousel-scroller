import React, { Component } from 'react';

import css from './option-input.css';

const labelFor = name => `option-input-${name}`;

export default class OptionInput extends Component {
  constructor(props) {
    super(props);
    this.onChangeItemNr = this.onChangeItemNr.bind(this);
    this.onChangeOrientation = this.onChangeOrientation.bind(this);
    this.onChangeIndex = this.onChangeIndex.bind(this);
    this.onToggleDiffSize = this.onToggleDiffSize.bind(this);
    this.onTogglePageScroll = this.onTogglePageScroll.bind(this);
    this.onChangeListener = this.onChangeListener.bind(this);
  }

  onChangeItemNr(e) {
    this.props.onChange({
      ...this.props,
      nrOfItems: parseInt(e.target.value, 10)
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
      index: parseInt(e.target.value, 10)
    });
  }

  onToggleDiffSize(e) {
    this.props.onChange({
      ...this.props,
      isDiffSize: e.target.checked
    });
  }

  onTogglePageScroll(e) {
    this.props.onChange({
      ...this.props,
      isPageScrollPrevented: e.target.checked
    });
  }

  onChangeListener(e) {
    this.props.onChange({
      ...this.props,
      listener: e.target.value
    });
  }

  render() {
    return (
      <fieldset className={css.fieldset}>
        <div className={css.column}>
          <h3 className={css.columnHeadline}>Set options</h3>
          <div className={css.wrapper}>
            <label
              htmlFor={labelFor('nrOfItems')}
              className={css.labelBefore}
            >
              Nr. of items
            </label>
            <input
              id={labelFor('nrOfItems')}
              type="number"
              value={this.props.nrOfItems}
              onChange={this.onChangeItemNr}
            />
          </div>
          <div className={css.wrapper}>
            <label
              htmlFor={labelFor('orientation')}
              className={css.labelBefore}
            >
              Orientation
            </label>
            <select
              id={labelFor('orientation')}
              value={this.props.orientation}
              onChange={this.onChangeOrientation}
            >
              <option value="x">Horizontal</option>
              <option value="y">Vertical</option>
            </select>
          </div>
          <div className={css.wrapper}>
            <label
              htmlFor={labelFor('index')}
              className={css.labelBefore}
            >
              Index
            </label>
            <input
              id={labelFor('index')}
              type="number"
              min={0}
              max={this.props.nrOfItems}
              value={this.props.index}
              onChange={this.onChangeIndex}
            />
          </div>
          <div className={css.wrapper}>
            <label htmlFor={labelFor('diffSize')}>
              <input
                id={labelFor('diffSize')}
                type="checkbox"
                value={this.props.isDiffSize}
                onChange={this.onToggleDiffSize}
              />
              Different sizes
            </label>
          </div>
          <div className={css.wrapper}>
            <label htmlFor={labelFor('preventPageScroll')}>
              <input
                id={labelFor('preventPageScroll')}
                type="checkbox"
                value={this.props.isPageScrollPrevented}
                onChange={this.onTogglePageScroll}
              />
              Prevent page scroll
            </label>
          </div>
        </div>
        <div className={css.column}>
          <h3 className={css.columnHeadline}>Choose listener</h3>
          <div className={css.wrapper}>
            <label className={css.listenerOption}>
              <input
                type="radio"
                value="none"
                checked={this.props.listener === 'none'}
                onChange={this.onChangeListener}
              />
              None
            </label>
            <label className={css.listenerOption}>
              <input
                type="radio"
                value="basic"
                checked={this.props.listener === 'basic'}
                onChange={this.onChangeListener}
              />
              <pre className={css.codeOption}>
                <code>
                  {`
onChangeHandler(index) {
  this.setState({ index });
}
                  `}
                </code>
              </pre>
            </label>
          </div>
        </div>
      </fieldset>
    );
  }
}
