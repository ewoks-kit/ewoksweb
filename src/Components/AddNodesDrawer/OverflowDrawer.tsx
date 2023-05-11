import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddNodes from './AddNodes';
import toggleAddNodesSidebar from '../../store/toggleAddNodesSidebar';

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

  const setOpenAddNodesSidebar = toggleAddNodesSidebar(
    (state) => state.setOpenAddNodesSidebar
  );
  const openAddNodesSidebar = toggleAddNodesSidebar(
    (state) => state.openAddNodesSidebar
  );

  const toggleDrawer = () => {
    setOpenAddNodesSidebar(!openAddNodesSidebar);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        className={`${classes.drawer} ${
          openAddNodesSidebar ? classes.drawerOpen : classes.drawerClose
        }`}
        classes={{
          paper: `${classes.drawer} ${
            openAddNodesSidebar ? classes.drawerOpen : classes.drawerClose
          }`,
        }}
        open={openAddNodesSidebar}
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
        style={{ marginLeft: openAddNodesSidebar ? '230px' : '10px' }}
        className={classes.leftDrawerButton}
      >
        {openAddNodesSidebar ? (
          <ArrowBackIosIcon style={{ marginLeft: '8px' }} />
        ) : (
          <AddIcon />
        )}
      </Fab>
    </>
  );
}

export default OverflowDrawer;
