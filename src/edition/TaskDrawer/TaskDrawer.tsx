import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TaskList from './TaskList';
import useTaskDrawerState from '../../store/taskDrawerState';
import { useDrawerStyles } from './hooks';

import styles from './TaskDrawer.module.css';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';

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
