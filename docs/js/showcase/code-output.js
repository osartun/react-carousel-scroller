import React from 'react';

import css from './code-output.css';

const CodeOutput = (props) => (
  <pre className={css.wrapper}>
    <code>
      {`
<CarouselScroller
  index={${props.index}}
  orientation={${props.orientation}}
  className="scroller" ${
    props.listener !== 'none' ? `
  onChange={onChangeHandler}
    ` : ''
  }
>
  {_.times(${props.nrOfItems}).map(() => (
    <div className="item" ${
      props.isDiffSize ? `style={{ width: getWidth(…) }} ` : ''
    }/>
  ))}
</CarouselScroller>
      `}
    </code>
  </pre>
);

export default CodeOutput;
