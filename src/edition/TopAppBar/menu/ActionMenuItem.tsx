import type { SvgIcon } from '@mui/material';
import { Typography } from '@mui/material';
import { ListItemText, MenuItem } from '@mui/material';
import type { PropsWithChildren } from 'react';

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
      {keyShortcut && (
        <Typography
          style={{
            marginLeft: '20px',
            // border: 'double rgb(63, 81, 181)',
            borderRadius: '10',
            backgroundColor: 'rgb(232, 234, 244)',
            padding: '0 5',
          }}
          variant="body2"
          color="text.secondary"
        >
          {keyShortcut}
        </Typography>
      )}
    </MenuItem>
  );
}

export default ActionMenuItem;
