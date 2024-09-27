import { Tooltip } from '@mui/material';
import type { PropsWithChildren } from 'react';

import styles from './NodeContent.module.css';

interface Props {
  width?: number;
  borderColor?: string;
  tooltip?: string;
}

function NodeContent(props: PropsWithChildren<Props>) {
  const { width = 100, borderColor, tooltip, children } = props;

  return (
    <div className={styles.wrapper} style={{ borderColor, width }}>
      {tooltip ? (
        <Tooltip
          title={<span className={styles.tooltip}>{tooltip}</span>}
          enterDelay={800}
          arrow
        >
          <div className={styles.content}>{children}</div>
        </Tooltip>
      ) : (
        <div className={styles.content}>{children}</div>
      )}
    </div>
  );
}

export default NodeContent;
