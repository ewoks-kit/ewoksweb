import { Tooltip } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { style } from './nodeStyles';

interface Props {
  width?: number;
  borderColor?: string;
  tooltip?: string;
}

function NodeContent(props: PropsWithChildren<Props>) {
  const { width = 100, borderColor, tooltip, children } = props;

  return (
    <div className="node-content" style={{ borderColor }}>
      <Tooltip
        title={tooltip ? <span style={style.comment}>{tooltip}</span> : ''}
        enterDelay={800}
        arrow
      >
        <span className="icons" style={{ ...style.displayNode, width }}>
          {children}
        </span>
      </Tooltip>
    </div>
  );
}

export default NodeContent;
