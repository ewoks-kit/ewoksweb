import { Typography } from '@material-ui/core';
import { useEffect } from 'react';
import { useState } from 'react';
import useStore from '../../store/useStore';
import { DrawerTab } from '../../types';
import GetFromServer from '../../General/GetFromServer';
import ProgressBar from '../../General/ProgressBar';
import OpenActionMenuButton from './menu/OpenActionMenuButton';
import SaveToServerButton from './SaveToServerButton';
import SettingsInfoDrawer from './SettingsInfoDrawer';
import TopAppBarLabel from './TopAppBarLabel';

import styles from '../EditPage.module.css';
import { createPortal } from 'react-dom';
import useNavBarElementStore from '../../navbar/useNavBarElementStore';

interface Props {
  checkAndNewGraph: (notSave: boolean) => void;
}

function TopAppBar(props: Props) {
  const { checkAndNewGraph } = props;

  const navBarElement = useNavBarElementStore((state) => state.element);

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

  if (!navBarElement) {
    return null;
  }

  return createPortal(
    <>
      <Typography component="h1" variant="h6" color="inherit" noWrap>
        <TopAppBarLabel />
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
    </>,
    navBarElement
  );
}

export default TopAppBar;
