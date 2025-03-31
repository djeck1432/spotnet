import React from 'react';

const SvgMock = React.forwardRef((props, ref) => (
  <span ref={ref} {...props} data-testid="svg-mock">
    SVG Mock
  </span>
));

SvgMock.displayName = 'SvgMock';

module.exports = SvgMock;
