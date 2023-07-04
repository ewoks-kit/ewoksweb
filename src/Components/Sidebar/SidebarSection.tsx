import { Paper, Typography } from '@material-ui/core';
import type { PropsWithChildren, ReactNode } from 'react';
import styles from './EditSidebar.module.css';

interface Props {
  title?: ReactNode;
}

function SidebarSection(props: PropsWithChildren<Props>) {
  const { title, children } = props;

  return (
    <Paper className={styles.section}>
      {title && (
        <Typography className={styles.sectionTitle}>{title}</Typography>
      )}
      {children}
    </Paper>
  );
}

export default SidebarSection;
