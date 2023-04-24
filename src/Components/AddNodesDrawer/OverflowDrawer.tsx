import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddNodes from './AddNodes';
import { useToggle } from '@react-hookz/web/esm/useToggle';
import { useCallback } from 'react';
import { getTaskDescription } from '../../api/tasks';
import useStore from 'store/useStore';
import { textForError } from '../../utils';
import commonStrings from 'commonStrings.json';

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'auto',
    width: '0px',
    height: '100%',
    flex: 'none',
    borderRight: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawerOpen: {
    width: '250px',
  },
  drawerClose: {
    width: '1px',
  },
  leftDrawerButton: {
    position: 'absolute',
    top: theme.spacing(9),
    zIndex: theme.zIndex.drawer + 1,
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
}));

function OverflowDrawer() {
  const classes = useStyles();
  const [isToggled, toggle] = useToggle(false);

  const setTasks = useStore((state) => state.setTasks);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const toggleDrawer = () => {
    if (!isToggled) {
      getTasks();
    }
    toggle(!isToggled);
  };

  const getTasks = useCallback(async () => {
    try {
      const tasksData = await getTaskDescription();
      if (tasksData.data.items.length > 0) {
        const allTasks = tasksData.data.items;
        setTasks(allTasks);
      }
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.retrieveTasksError),
        severity: 'error',
      });
    }
  }, [setOpenSnackbar, setTasks]);

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        className={`${classes.drawer} ${
          isToggled ? classes.drawerOpen : classes.drawerClose
        }`}
        classes={{
          paper: `${classes.drawer} ${
            isToggled ? classes.drawerOpen : classes.drawerClose
          }`,
        }}
        open={isToggled}
      >
        <aside className="dndflow">
          <AddNodes title="Add Nodes" />
        </aside>
      </Drawer>
      <Fab
        size="small"
        color="primary"
        aria-label="add"
        onClick={toggleDrawer}
        style={{ marginLeft: isToggled ? '230px' : '10px' }}
        className={classes.leftDrawerButton}
      >
        {isToggled ? (
          <ArrowBackIosIcon style={{ marginLeft: '8px' }} />
        ) : (
          <AddIcon />
        )}
      </Fab>
    </>
  );
}

export default OverflowDrawer;
