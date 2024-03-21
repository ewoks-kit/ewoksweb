import MenuIcon from '@mui/icons-material/Menu';
import { Button, Menu, Tooltip } from '@mui/material';
import MenuList from '@mui/material/MenuList';
import { useState } from 'react';
import type { Edge, Node } from 'reactflow';

import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import { isNodeRF } from '../../../utils/typeGuards';
import LinkSidebarMenu from './LinkSidebarMenu';
import NodeSidebarMenu from './NodeSidebarMenu';

interface Props {
  selectedElement: Node | Edge;
}

export default function EditSidebarMenu(props: Props) {
  const { selectedElement } = props;
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
          {isNodeRF(selectedElement) ? (
            <SuspenseBoundary>
              <NodeSidebarMenu
                selectedElement={selectedElement}
                onSelection={() => setAnchorEl(null)}
              />
            </SuspenseBoundary>
          ) : (
            <LinkSidebarMenu
              selectedElement={selectedElement}
              onSelection={() => setAnchorEl(null)}
            />
          )}
        </MenuList>
      </Menu>
    </>
  );
}
