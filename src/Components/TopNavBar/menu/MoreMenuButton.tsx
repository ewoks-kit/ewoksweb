import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreMenuList from './MoreMenuList';
import StyledMenu from './StyledMenu';
import { IconButton } from '@material-ui/core';

interface Props {
  checkAndNewGraph: () => void;
  handleOpenSettings: () => void;
}

const useStyles = makeStyles(() => ({
  openFileButton: {
    '&:hover': {
      backgroundColor: '#96a5f9',
    },
  },
}));

export default function MoreMenuButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const classes = useStyles();

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
