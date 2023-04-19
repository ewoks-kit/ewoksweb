import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AddIcon from '@material-ui/icons/Add';
import { Fab } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AddNodes from './AddNodes';

const useStyles = makeStyles((theme) => ({
  drawer: {
    // backgroundColor: theme.palette.background.paper,
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
    // transition: 'transform 0.3s ease-in-out',
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
  // Needed for the rest of the elements if we need to push the rest
  // content: {
  //   marginLeft: '300px', // Same as drawer width
  //   width: 'calc(100% - 300px)', // Width of content = 100% - drawer width
  // },
  leftDrawerButton: {
    position: 'absolute',
    top: theme.spacing(9),
    zIndex: theme.zIndex.drawer + 1,
    transition: 'transform 0.3s ease-in-out',
  },
}));

function OverflowDrawer() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="left"
        className={`${classes.drawer} ${
          open ? classes.drawerOpen : classes.drawerClose
        }`}
        classes={{
          paper: `${classes.drawer} ${
            open ? classes.drawerOpen : classes.drawerClose
          }`,
        }}
        open={open}
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
        style={{ marginLeft: open ? '230px' : '10px' }}
        className={classes.leftDrawerButton}
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
