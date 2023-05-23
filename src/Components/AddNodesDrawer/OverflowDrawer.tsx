import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddNodes from './AddNodes';
import addNodesSidebarState from '../../store/addNodesSidebarState';
import { useReactFlow } from 'reactflow';

const useStyles = makeStyles((theme) => ({
  drawer: {
    overflow: 'auto',
    width: '0px',
    height: '100%',
    flex: 'none',
    borderRight: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer,
    // The following can make the drawer to overflow the canvas if needed
    // position: 'absolute',
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

  const { fitView } = useReactFlow();

  const toggleAddNodesSidebar = addNodesSidebarState(
    (state) => state.toggleAddNodesSidebar
  );
  const isAddNodesSidebarOpen = addNodesSidebarState(
    (state) => state.isAddNodesSidebarOpen
  );

  const toggleDrawer = () => {
    toggleAddNodesSidebar(!isAddNodesSidebarOpen);
    setTimeout(() => {
      fitView({ duration: 800 });
    }, 300);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        className={`${classes.drawer} ${
          isAddNodesSidebarOpen ? classes.drawerOpen : classes.drawerClose
        }`}
        classes={{
          paper: `${classes.drawer} ${
            isAddNodesSidebarOpen ? classes.drawerOpen : classes.drawerClose
          }`,
        }}
        open={isAddNodesSidebarOpen}
      >
        <aside className="dndflow">
          <AddNodes title="Add Nodes" />
        </aside>
      </Drawer>
      <Fab
        size="small"
        color="primary"
        aria-label="addNodes"
        onClick={toggleDrawer}
        style={{ marginLeft: isAddNodesSidebarOpen ? '230px' : '10px' }}
        className={classes.leftDrawerButton}
      >
        {isAddNodesSidebarOpen ? (
          <ArrowBackIosIcon style={{ marginLeft: '8px' }} />
        ) : (
          <AddIcon />
        )}
      </Fab>
    </>
  );
}

export default OverflowDrawer;
