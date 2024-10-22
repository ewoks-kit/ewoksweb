import { Tooltip } from '@mui/material';
import type { PropsWithChildren, ReactElement } from 'react';

import styles from './Nodes.module.css';

interface Props {
  tooltip?: string;
}

function NodeTooltip(props: PropsWithChildren<Props>) {
  const { tooltip, children } = props;

  if (!tooltip) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <Tooltip
      title={<span className={styles.tooltip}>{tooltip}</span>}
      enterDelay={800}
      arrow
    >
      {children as ReactElement}
    </Tooltip>
  );
}

export default NodeTooltip;
