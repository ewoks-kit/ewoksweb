import MenuIcon from '@mui/icons-material/Menu';
import { Button, Menu, Tooltip } from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';

import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import styles from '../EditSidebar.module.css';

interface Props {
  title: string;
  renderMenuItems?: (onClose: () => void) => ReactNode;
}

export default function TitleWithMenu(props: Props) {
  const { title, renderMenuItems } = props;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const onClose = () => setAnchorEl(null);

  return (
    <div className={styles.titleBar}>
      <span className={styles.title}>{title}</span>
      {renderMenuItems && (
        <>
          <Tooltip title="Delete, Clone" arrow>
            <Button
              color="primary"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              size="small"
              aria-controls="editSidebar-dropdown-menu"
              aria-label="Open edit actions menu"
            >
              <MenuIcon />
            </Button>
          </Tooltip>
          <Menu
            id="editSidebar-dropdown-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
          >
            <SuspenseBoundary>{renderMenuItems(onClose)}</SuspenseBoundary>
          </Menu>
        </>
      )}
    </div>
  );
}
