import type { SvgIcon } from '@mui/material';
import { ListItemText, MenuItem } from '@mui/material';
import type { PropsWithChildren } from 'react';

import KeyStrokeHint from '../../keyStrokeHint';
import { useActionMenuContext } from './ActionMenuContext';
import ActionMenuIcon from './ActionMenuIcon';

interface Props {
  icon: typeof SvgIcon;
  label: string;
  keyShortcut?: string;
  onClick: () => void;
}

function ActionMenuItem(props: PropsWithChildren<Props>) {
  const { icon, label, keyShortcut, onClick, children } = props;

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
      {keyShortcut && <KeyStrokeHint text={keyShortcut} />}
    </MenuItem>
  );
}

export default ActionMenuItem;
