import React from 'react';
import classNames from 'classnames';
import CarouselScroller from '../src/carousel-scroller';

import style from './showcase-scroller.css';

const diffSizes = [100, 80, 140, 50, 110, 70, 90, 150, 130, 60];

const orientationClassName = (orientation) => (
  orientation === 'x' ? 'horizontal' : 'vertical'
);

const getItemStyle = (i, { isDiffSize, orientation }) => isDiffSize ? (
  {
    [orientation === 'x' ? 'width' : 'height']: diffSizes[i % diffSizes.length]
  }
) : null;

const ShowcaseScroller = (props) => (
  <div
    className={classNames(style.wrapper, style[orientationClassName(props.orientation)])}
  >
    <CarouselScroller
      index={props.index}
      orientation={props.orientation}
      className={style.scroller}
      onChange={props.onChange}
      preventPageScroll={props.isPageScrollPrevented}
    >
      {_.times(props.nrOfItems).map((u, i) => (
        <div
          key={i}
          data-i={i + 1}
          className={style.item}
          style={getItemStyle(i, props)}
        />
      ))}
    </CarouselScroller>
  </div>
);

export default ShowcaseScroller;
