import { FileCopy } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { useState } from 'react';

import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import useStore from '../../../store/useStore';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';

function SaveAsButton() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  return (
    <>
      <SuspenseBoundary>
        <GraphFormDialog
          elementToEdit={displayedWorkflowInfo}
          isOpen={openSaveDialog}
          onClose={() => setOpenSaveDialog(false)}
        />
      </SuspenseBoundary>

      <MenuItem
        onClick={() => setOpenSaveDialog(true)}
        role="menuitem"
        disabled={
          !rootWorkflowId || rootWorkflowId !== displayedWorkflowInfo.id
        }
      >
        <ListItemIcon>
          <FileCopy fontSize="small" />
        </ListItemIcon>
        <ListItemText>Save as...</ListItemText>
      </MenuItem>
    </>
  );
}

export default SaveAsButton;
