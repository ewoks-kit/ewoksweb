import { IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import React from 'react';

import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import styles from './ActionMenu.module.css';
import { ActionMenuContext } from './ActionMenuContext';
import DownloadMenuItem from './DownloadMenuItem';
import ExecutionMenuItem from './ExecutionMenuItem';
import NewTaskMenuItem from './NewTaskMenuItem';
import OpenDrawerMenuItem from './OpenDrawerMenuItem';
import OpenNewWorkflowMenuItem from './OpenNewWorkflowMenuItem';
import UploadMenuItem from './UploadMenuItem';

export default function OpenActionMenuButton() {
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
        aria-label="Open menu with more actions"
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
          <SuspenseBoundary>
            <OpenNewWorkflowMenuItem />
          </SuspenseBoundary>
          <SuspenseBoundary>
            <UploadMenuItem />
          </SuspenseBoundary>
          <DownloadMenuItem />
          <ExecutionMenuItem />
          <OpenDrawerMenuItem />
          <NewTaskMenuItem />
        </ActionMenuContext.Provider>
      </Menu>
    </div>
  );
}
