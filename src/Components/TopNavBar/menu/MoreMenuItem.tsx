import { ListItemText } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';
import MoreMenuIcon from './MoreMenuIcon';
import StyledMenuItem from './StyledMenuItem';

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
