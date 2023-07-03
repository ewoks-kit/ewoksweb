import { AppBar, Toolbar, Typography, useTheme } from '@material-ui/core';
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

interface Props {
  classes: { appBar: string; toolbar: string; title: string };
  checkAndNewGraph: (notSave: boolean) => void;
}

function TopAppBar(props: Props) {
  const { classes, checkAndNewGraph } = props;

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
    if (openSettingsDrawer === DrawerTab.Executions) {
      setOpenInfo(false);
      setOpenDrawers(true);
      setOpenSettings(true);
      return;
    }

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
      className={classes.appBar}
      position="static"
      style={{ zIndex: zIndex.drawer + 1 }}
    >
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.title}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              flexBasis: '40%',
            }}
          >
            <b
              style={{
                fontSize: '18px',
                letterSpacing: '2px',
              }}
            >
              EwoksWeb
            </b>
            <span
              style={{
                fontSize: '14px',
                padding: '5px',
              }}
            >
              Edit
            </span>
            |
            <span
              style={{
                fontSize: '14px',
                padding: '5px',
              }}
            >
              Monitor
            </span>
          </span>

          <span style={{ flexBasis: '50%' }}>
            <TopNavbarLabel />
          </span>
        </Typography>
        <GetFromServer />

        <SaveToServerButton />
        <div>
          <OpenActionMenuButton
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
