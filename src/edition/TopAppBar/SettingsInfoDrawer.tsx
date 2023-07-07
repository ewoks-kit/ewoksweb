import React from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import BasicTabs from '../TopDrawer/BasicTabs';
import { DrawerTab } from '../../types';

interface SettingsInfoDrawerProps {
  drawerTab: DrawerTab;
  setDrawerTab: (drawerTab: DrawerTab) => void;
}

export default function SettingsInfoDrawer(props: SettingsInfoDrawerProps) {
  const { drawerTab, setDrawerTab } = props;

  return (
    <Drawer
      style={{ alignItems: 'center', display: 'flex' }}
      anchor="top"
      open={drawerTab !== DrawerTab.Closed}
      onClose={() => setDrawerTab(DrawerTab.Closed)}
    >
      <Box sx={{ width: 'auto' }} role="presentation">
        <BasicTabs tab={drawerTab} setDrawerTab={setDrawerTab} />
        <Divider />
      </Box>
    </Drawer>
  );
}
