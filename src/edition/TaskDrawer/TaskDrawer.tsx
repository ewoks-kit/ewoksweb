import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

import useTaskDrawerState from '../../store/taskDrawerState';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { useDrawerStyles } from './hooks';
import styles from './TaskDrawer.module.css';
import TaskList from './TaskList';

function OverflowDrawer() {
  const { open, setOpen } = useTaskDrawerState();

  const drawerStyles = useDrawerStyles();

  return (
    <>
      <div
        className={styles.drawer}
        data-open={open || undefined}
        style={{
          ...drawerStyles,
        }}
      >
        <SuspenseBoundary>
          <TaskList />
        </SuspenseBoundary>
      </div>
      <Fab
        className={styles.openButton}
        size="small"
        color="primary"
        aria-label={`${open ? 'Close' : 'Open'} task drawer`}
        onClick={() => setOpen(!open)}
        style={{
          zIndex: drawerStyles.zIndex + 1,
        }}
        data-open={open || undefined}
      >
        {open ? (
          <ArrowBackIosIcon style={{ marginLeft: '8px' }} />
        ) : (
          <AddIcon />
        )}
      </Fab>
    </>
  );
}

export default OverflowDrawer;
