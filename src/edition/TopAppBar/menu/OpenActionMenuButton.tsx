import { IconButton, Menu } from '@material-ui/core';
import { FiberNew } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';
import { ActionMenuContext } from './ActionMenuContext';
import ActionMenuItem from './ActionMenuItem';
import DiscoverMenuItem from './DiscoverMenuItem';
import DownloadMenuItem from './DownloadMenuItem';
import UploadMenuItem from './UploadMenuItem';

import styles from './ActionMenu.module.css';
import ExecutionMenuItem from './ExecutionMenuItem';
import OpenDrawerMenuItem from './OpenDrawerMenuItem';

interface Props {
  checkAndNewGraph: () => void;
  handleOpenSettings: () => void;
}

export default function OpenActionMenuButton(props: Props) {
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
        // https://github.com/mui/material-ui/issues/10804#issuecomment-376266662
        getContentAnchorEl={null}
      >
        <ActionMenuContext.Provider value={{ open, onClose }}>
          <ActionMenuItem
            icon={FiberNew}
            label="New workflow"
            onClick={checkAndNewGraph}
          />
          <UploadMenuItem />
          <DownloadMenuItem />
          <DiscoverMenuItem />
          <ExecutionMenuItem />
          <OpenDrawerMenuItem handleOpenSettings={handleOpenSettings} />
        </ActionMenuContext.Provider>
      </Menu>
    </div>
  );
}
