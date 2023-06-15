import Drawer from '@material-ui/core/Drawer';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import TaskList from './TaskList';
import useTaskDrawerState from '../../store/taskDrawerState';
import { useDrawerStyles } from './hooks';

import styles from './TaskDrawer.module.css';

function OverflowDrawer() {
  const { open, setOpen } = useTaskDrawerState();

  const drawerStyles = useDrawerStyles();

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        classes={{
          root: styles.drawer,
          paper: styles.paper,
        }}
        open={open}
        style={{
          width: open ? '250px' : '0px',
          ...drawerStyles,
        }}
      >
        <aside className="dndflow">
          <TaskList />
        </aside>
      </Drawer>
      <Fab
        className={styles.openButton}
        size="small"
        color="primary"
        aria-label={`${open ? 'Close' : 'Open'} task drawer`}
        onClick={() => setOpen(!open)}
        style={{
          left: open ? '230px' : '10px',
          zIndex: drawerStyles.zIndex + 1,
        }}
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
