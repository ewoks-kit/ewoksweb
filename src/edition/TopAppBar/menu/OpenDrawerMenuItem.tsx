import { Settings } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import useStore from '../../../store/useStore';
import { DrawerTab } from '../../../types';
import SettingsInfoDrawer from '../SettingsInfoDrawer';
import ActionMenuItem from './ActionMenuItem';

function OpenDrawerMenuItem() {
  const [openDrawers, setOpenDrawers] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);

  const openSettingsDrawer = useStore((state) => state.openSettingsDrawer);
  const setOpenSettingsDrawer = useStore(
    (state) => state.setOpenSettingsDrawer
  );

  useEffect(() => {
    if (!openDrawers) {
      setOpenSettings(false);
      setOpenSettingsDrawer(DrawerTab.Workflows);
    }
  }, [openDrawers, openSettings, setOpenSettingsDrawer]);

  useEffect(() => {
    if (openSettingsDrawer === DrawerTab.Closed) {
      setOpenDrawers(false);
      setOpenSettings(false);
    }
  }, [openSettingsDrawer]);

  function handleOpenSettings() {
    setOpenSettings(true);
    setOpenDrawers(true);
  }

  function handleOpenDrawers() {
    setOpenDrawers(!openDrawers);
  }

  return (
    <>
      <ActionMenuItem
        icon={Settings}
        label="Settings"
        onClick={handleOpenSettings}
      />
      <SettingsInfoDrawer
        handleOpenDrawers={handleOpenDrawers}
        openDrawers={openDrawers}
        openSettings={openSettings}
      />
    </>
  );
}

export default OpenDrawerMenuItem;
