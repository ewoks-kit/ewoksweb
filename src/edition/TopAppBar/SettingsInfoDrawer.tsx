import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import BasicTabs from '../TopDrawer/BasicTabs';

interface SettingsInfoDrawerProps {
  openDrawers: boolean;
  openSettings: boolean;
  handleOpenDrawers: () => void;
}

export default function SettingsInfoDrawer(props: SettingsInfoDrawerProps) {
  const [isOpen, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(props.openDrawers && props.openSettings);
  }, [props.openSettings, props.openDrawers]);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    props.handleOpenDrawers();
    setOpen(open); // left: open , for opening both-active 1
  };

  return (
    <Drawer
      style={{ alignItems: 'center', display: 'flex' }}
      anchor="top"
      open={isOpen}
      onClose={toggleDrawer(false)}
    >
      <Box sx={{ width: 'auto' }} role="presentation">
        <BasicTabs />
        <Divider />
      </Box>
    </Drawer>
  );
}
