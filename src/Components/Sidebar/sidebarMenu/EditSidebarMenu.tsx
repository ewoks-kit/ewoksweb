import { useState } from 'react';

import MenuList from '@material-ui/core/MenuList';
import { Button, Menu, Tooltip } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import type { SelectedElementRF } from '../../../types';
import { isNodeRF } from '../../../utils/typeGuards';
import NodeSidebarMenu from './NodeSidebarMenu';
import WorkflowSidebarMenu from './WorkflowSidebarMenu';
import LinkSidebarMenu from './LinkSidebarMenu';

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
          style={{
            margin: '2px 8px',
          }}
          color="primary"
          onClick={handleClick}
          size="small"
          aria-controls="editSidebar-dropdown-menu"
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
            <WorkflowSidebarMenu />
          ) : isNodeRF(selectedElement) ? (
            <NodeSidebarMenu {...selectedElement} />
          ) : (
            <LinkSidebarMenu {...selectedElement} />
          )}
        </MenuList>
      </Menu>
    </>
  );
}
