import React from 'react';
import Drawer from '@material-ui/core/Drawer';
import DashboardStyle from './DashboardStyle';
import Divider from '@material-ui/core/Divider';
import { IconButton } from '@material-ui/core';
import clsx from 'clsx';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Sidebar from '../sidebar';
import useStore from '../store';

const useStyles = DashboardStyle;

export default function MyDrawer() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(true);
  const selectedElement = useStore((state) => state.selectedElement);

  const handleDrawerOpen = () => {
    setOpen(true);
    // setEditing(!editing);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
      }}
      open={open}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <Divider />
      <Sidebar element={selectedElement} />
    </Drawer>
  );
}
