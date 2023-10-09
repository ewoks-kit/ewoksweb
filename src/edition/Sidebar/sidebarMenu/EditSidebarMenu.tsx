import MenuIcon from '@material-ui/icons/Menu';
import { Button, Menu, Tooltip } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import { useState } from 'react';

import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import type { SelectedElementRF } from '../../../types';
import { isNodeRF } from '../../../utils/typeGuards';
import LinkSidebarMenu from './LinkSidebarMenu';
import NodeSidebarMenu from './NodeSidebarMenu';
import WorkflowSidebarMenu from './WorkflowSidebarMenu';

export default function EditSidebarMenu({
  selectedElement,
}: SelectedElementRF) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <Tooltip title="Delete, Clone" arrow>
        <Button
          color="primary"
          onClick={handleClick}
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
        onClose={handleClose}
      >
        <MenuList>
          {!selectedElement ? (
            <SuspenseBoundary>
              <WorkflowSidebarMenu />
            </SuspenseBoundary>
          ) : isNodeRF(selectedElement) ? (
            <SuspenseBoundary>
              <NodeSidebarMenu {...selectedElement} />
            </SuspenseBoundary>
          ) : (
            <LinkSidebarMenu {...selectedElement} />
          )}
        </MenuList>
      </Menu>
    </>
  );
}
