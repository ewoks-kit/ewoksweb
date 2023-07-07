import { Settings } from '@material-ui/icons';
import { useState } from 'react';
import { DrawerTab } from '../../../types';
import SettingsInfoDrawer from '../SettingsInfoDrawer';
import ActionMenuItem from './ActionMenuItem';

function OpenDrawerMenuItem() {
  const [drawerTab, setDrawerTab] = useState(DrawerTab.Closed);

  return (
    <>
      <ActionMenuItem
        icon={Settings}
        label="Settings"
        onClick={() => setDrawerTab(DrawerTab.Workflows)}
      />
      <SettingsInfoDrawer drawerTab={drawerTab} setDrawerTab={setDrawerTab} />
    </>
  );
}

export default OpenDrawerMenuItem;
