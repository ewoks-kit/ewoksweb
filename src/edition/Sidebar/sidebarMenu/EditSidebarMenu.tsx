import MenuIcon from '@mui/icons-material/Menu';
import { Button, Menu, Tooltip } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import { useState } from 'react';

import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import type { SelectedElement } from '../../../types';
import { isNodeRF } from '../../../utils/typeGuards';
import LinkSidebarMenu from './LinkSidebarMenu';
import NodeSidebarMenu from './NodeSidebarMenu';
import WorkflowSidebarMenu from './WorkflowSidebarMenu';

export default function EditSidebarMenu({ selectedElement }: SelectedElement) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
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
        onClose={() => setAnchorEl(null)}
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
