import React from 'react';
import Button from '@material-ui/core/Button';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoreMenuList from './MoreMenuList';
import StyledMenu from './StyledMenu';

interface Props {
  checkAndNewGraph: () => void;
  handleOpenSettings: () => void;
}

export default function MoreMenuButton(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="navbar-dropdown-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{
          margin: '8px',
          borderRadius: '20px',
          minWidth: '30px',
          maxWidth: '40px',
        }}
      >
        <MoreVertIcon />
      </Button>

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
