import { AppBar, Typography, useTheme } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import useStore from '../../store/useStore';
import { DrawerTab } from '../../types';
import GetFromServer from '../General/GetFromServer';
import ProgressBar from '../General/ProgressBar';
import OpenActionMenuButton from '../TopNavBar/menu/OpenActionMenuButton';
import SaveToServerButton from '../TopNavBar/SaveToServerButton';
import SettingsInfoDrawer from '../TopNavBar/SettingsInfoDrawer';
import TopNavbarLabel from '../TopNavBar/TopNavbarLabel';

import styles from './EditPage.module.css';

interface Props {
  checkAndNewGraph: (notSave: boolean) => void;
}

function TopAppBar(props: Props) {
  const { checkAndNewGraph } = props;

  const { zIndex } = useTheme();

  const [openDrawers, setOpenDrawers] = useState(true);
  const [openSettings, setOpenSettings] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);

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
      setOpenInfo(false);
      setOpenDrawers(false);
      setOpenSettings(false);
    }
  }, [openSettingsDrawer]);

  function handleOpenSettings() {
    setOpenInfo(false);
    setOpenSettings(true);
    setOpenDrawers(true);
  }

  function handleOpenDrawers() {
    setOpenDrawers(!openDrawers);
  }

  return (
    <AppBar
      className={styles.appBar}
      position="static"
      style={{ zIndex: zIndex.drawer + 1 }}
    >
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        <TopNavbarLabel />
      </Typography>

      <div className={styles.toolbar}>
        <GetFromServer />
        <SaveToServerButton />
        <OpenActionMenuButton
          checkAndNewGraph={() => checkAndNewGraph(false)}
          handleOpenSettings={handleOpenSettings}
        />

        <SettingsInfoDrawer
          handleOpenDrawers={handleOpenDrawers}
          openDrawers={openDrawers}
          openInfo={openInfo}
          openSettings={openSettings}
        />
      </div>
      <ProgressBar />
    </AppBar>
  );
}

export default TopAppBar;
