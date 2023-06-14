import { ListItemText, MenuItem } from '@material-ui/core';
import type { SvgIcon } from '@material-ui/core';
import ActionMenuIcon from './ActionMenuIcon';
import { useActionMenuContext } from './ActionMenuContext';
import type { PropsWithChildren } from 'react';

interface Props {
  icon: typeof SvgIcon;
  label: string;
  onClick: () => void;
}

function MoreMenuItem(props: PropsWithChildren<Props>) {
  const { icon, label, onClick, children } = props;

  const { onClose } = useActionMenuContext();

  return (
    <MenuItem
      onClick={() => {
        onClick();
        onClose();
      }}
      role="menuitem"
    >
      <ActionMenuIcon icon={icon} />
      <ListItemText primary={label} />
      {children}
    </MenuItem>
  );
}

export default MoreMenuItem;
