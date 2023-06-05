import React from 'react';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreMenuList from './MoreMenuList';
import StyledMenu from './StyledMenu';
import { IconButton } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';

interface Props {
  checkAndNewGraph: () => void;
  handleOpenSettings: () => void;
}

export default function MoreMenuButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const classes = useDashboardStyles();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className={classes.openFileButton}
        aria-controls="navbar-dropdown-menu"
        aria-haspopup="true"
        color="inherit"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>

      <StyledMenu
        id="navbar-dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={anchorEl !== null}
        onClose={handleClose}
      >
        <MoreMenuList {...props} />
      </StyledMenu>
    </div>
  );
}
