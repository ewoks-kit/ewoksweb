import { ListItemText } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';
import MoreMenuIcon from './MoreMenuIcon';
import StyledMenuItem from './StyledMenuItem';
import { useMenuContext } from './MenuContext';

interface Props {
  icon: typeof SvgIcon;
  label: string;
  onClick: () => void;
}

function MoreMenuItem(props: Props) {
  const { icon, label, onClick } = props;

  const { onClose } = useMenuContext();

  return (
    <StyledMenuItem
      onClick={() => {
        onClick();
        onClose();
      }}
      role="menuitem"
    >
      <MoreMenuIcon icon={icon} />
      <ListItemText primary={label} />
    </StyledMenuItem>
  );
}

export default MoreMenuItem;
