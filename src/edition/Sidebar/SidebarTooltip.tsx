import { Tooltip } from '@mui/material';
import type { ReactElement } from 'react';

import styles from './SidebarTooltip.module.css';

interface Props {
  text: string;
  children: ReactElement;
}

export default function SidebarTooltip(props: Props) {
  const { text, children } = props;

  return (
    <Tooltip
      placement="right"
      enterDelay={500}
      classes={{ tooltip: styles.container }}
      title={<span className={styles.text}>{text}</span>}
      arrow
    >
      {children}
    </Tooltip>
  );
}
