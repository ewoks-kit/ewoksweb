import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { IconButton, Menu } from '@material-ui/core';
import styles from './MoreMenu.module.css';
import { FiberNew, Settings } from '@material-ui/icons';
import DiscoverMenuItem from './DiscoverMenuItem';
import MoreMenuItem from './MoreMenuItem';
import UploadMenuItem from './UploadMenuItem';
import DownloadMenuItem from './DownloadMenuItem';
import { MenuContext } from './MenuContext';

interface Props {
  checkAndNewGraph: () => void;
  handleOpenSettings: () => void;
}

export default function MoreMenuButton(props: Props) {
  const { checkAndNewGraph, handleOpenSettings } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = anchorEl !== null;
  const onClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className={styles.openMenuButton}
        aria-controls="navbar-dropdown-menu"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        id="navbar-dropdown-menu"
        PaperProps={{ className: styles.paper }}
        keepMounted
        elevation={0}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuContext.Provider value={{ open, onClose }}>
          <MoreMenuItem
            icon={FiberNew}
            label="New workflow"
            onClick={checkAndNewGraph}
          />
          <UploadMenuItem />
          <DownloadMenuItem />
          <DiscoverMenuItem />
          <MoreMenuItem
            icon={Settings}
            label="Settings"
            onClick={handleOpenSettings}
          />
        </MenuContext.Provider>
      </Menu>
    </div>
  );
}
