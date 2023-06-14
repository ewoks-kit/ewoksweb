import { ListItemText, MenuItem } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';
import MoreMenuIcon from './MoreMenuIcon';
import { useMenuContext } from './MenuContext';
import type { PropsWithChildren } from 'react';

interface Props {
  icon: typeof SvgIcon;
  label: string;
  onClick: () => void;
}

function MoreMenuItem(props: PropsWithChildren<Props>) {
  const { icon, label, onClick, children } = props;

  const { onClose } = useMenuContext();

  return (
    <MenuItem
      onClick={() => {
        onClick();
        onClose();
      }}
      role="menuitem"
    >
      <MoreMenuIcon icon={icon} />
      <ListItemText primary={label} />
      {children}
    </MenuItem>
  );
}

export default MoreMenuItem;
