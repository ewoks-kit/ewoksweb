import { withStyles } from '@material-ui/core';
import { ListItemIcon, ListItemText, MenuItem } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';

type SvgIconComponent = typeof SvgIcon;

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
  icon: SvgIconComponent;
  label: string;
  onClick: () => void;
}

function MoreMenuItem(props: Props) {
  const { icon: Icon, label, onClick } = props;

  return (
    <StyledMenuItem onClick={onClick} role="menuitem">
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary={label} />
    </StyledMenuItem>
  );
}

export default MoreMenuItem;
