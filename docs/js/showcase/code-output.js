import React from 'react';

import css from './code-output.css';

const CodeOutput = (props) => (
  <pre className={css.wrapper}>
    <code>
      {`
<div className="container ${props.orientation === 'x' ? 'horizontal' : 'vertical'}" style={{
  position: 'relative',
  overflow: 'hidden', ${props.orientation === 'x' ? `
  height: '100px',
  width: '100%'` : `
  height: '300px',
  width: '100px'`}
}}>
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
</div>
      `}
    </code>
  </pre>
);

export default CodeOutput;
