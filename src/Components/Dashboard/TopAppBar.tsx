import { AppBar, Toolbar, useTheme } from '@material-ui/core';
import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import useStore from '../../store/useStore';
import GetFromServer from '../General/GetFromServer';
import ProgressBar from '../General/ProgressBar';
import MoreMenuButton from '../TopNavBar/menu/MoreMenuButton';
import SettingsInfoDrawer from '../TopNavBar/SettingsInfoDrawer';
import SubgraphsStack from '../TopNavBar/SubgraphsStack';

interface Props {
  classes: { appBar: string; toolbar: string };
  checkAndNewGraph: (notSave: boolean) => void;
}

function TopAppBar(props: PropsWithChildren<Props>) {
  const { classes, checkAndNewGraph, children } = props;

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
      setOpenSettingsDrawer('Workflows');
    }
  }, [openDrawers, openSettings, setOpenSettingsDrawer]);

  useEffect(() => {
    if (openSettingsDrawer === 'Executions') {
      setOpenInfo(false);
      setOpenDrawers(true);
      setOpenSettings(true);
      return;
    }

    if (openSettingsDrawer === 'close') {
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
      className={classes.appBar}
      position="static"
      style={{ zIndex: zIndex.drawer + 1 }}
    >
      <Toolbar className={classes.toolbar}>
        <SubgraphsStack />
        <GetFromServer />

        {children}

        <div>
          <MoreMenuButton
            checkAndNewGraph={() => checkAndNewGraph(false)}
            handleOpenSettings={handleOpenSettings}
          />
        </div>
        <SettingsInfoDrawer
          handleOpenDrawers={handleOpenDrawers}
          openDrawers={openDrawers}
          openInfo={openInfo}
          openSettings={openSettings}
        />
      </Toolbar>
      <ProgressBar />
    </AppBar>
  );
}

export default TopAppBar;
