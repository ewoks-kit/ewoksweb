import { withStyles } from '@material-ui/core';
import { ListItemText, MenuItem } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';
import MoreMenuIcon from './MoreMenuIcon';

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

interface Props {
  icon: typeof SvgIcon;
  label: string;
  onClick: () => void;
}

function MoreMenuItem(props: Props) {
  const { icon, label, onClick } = props;

  return (
    <StyledMenuItem onClick={onClick} role="menuitem">
      <MoreMenuIcon icon={icon} />
      <ListItemText primary={label} />
    </StyledMenuItem>
  );
}

export default MoreMenuItem;
