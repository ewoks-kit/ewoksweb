import React, { useEffect } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { Box } from '@material-ui/core';

import ManageIcons from './ManageIcons';
import ManageWorkflows from './ManageWorkflows';
import useStore from '../../store/useStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import { DrawerTab } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState<DrawerTab>(DrawerTab.Workflows);
  const openSettingsDrawer = useStore((state) => state.openSettingsDrawer);

  useEffect(() => {
    setValue(openSettingsDrawer);
  }, [openSettingsDrawer]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={(e, newValue: number) => {
            setValue(newValue);
          }}
          aria-label="basic tabs example"
        >
          <Tab label="Workflows" {...a11yProps(DrawerTab.Workflows)} />
          <Tab
            label="Icons"
            data-cy="iconsTab"
            {...a11yProps(DrawerTab.Icons)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={DrawerTab.Workflows}>
        <ManageWorkflows />
      </TabPanel>
      <TabPanel value={value} index={DrawerTab.Icons}>
        <SuspenseBoundary>
          <ManageIcons />
        </SuspenseBoundary>
      </TabPanel>
    </Box>
  );
}
