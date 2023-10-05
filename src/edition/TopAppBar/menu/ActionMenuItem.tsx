import type { SvgIcon } from '@material-ui/core';
import { ListItemText, MenuItem } from '@material-ui/core';
import type { PropsWithChildren } from 'react';

import { useActionMenuContext } from './ActionMenuContext';
import ActionMenuIcon from './ActionMenuIcon';

interface Props {
  icon: typeof SvgIcon;
  label: string;
  onClick: () => void;
}

function ActionMenuItem(props: PropsWithChildren<Props>) {
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

export default ActionMenuItem;
