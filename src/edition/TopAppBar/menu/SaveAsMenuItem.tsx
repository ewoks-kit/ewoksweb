import { FileCopy } from '@mui/icons-material';
import { useState } from 'react';

import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import useWorkflowStore from '../../../store/useWorkflowStore';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import ActionMenuItem from './ActionMenuItem';

function SaveAsMenuItem() {
  const [openSaveDialog, setOpenSaveDialog] = useState(false);

  const workflowId = useWorkflowStore((state) => state.workflowInfo.id);

  return (
    <>
      <SuspenseBoundary>
        <GraphFormDialog
          isOpen={openSaveDialog}
          onClose={() => setOpenSaveDialog(false)}
        />
      </SuspenseBoundary>

      <ActionMenuItem
        onClick={() => setOpenSaveDialog(true)}
        label="Save as..."
        icon={FileCopy}
        disabled={!workflowId}
      />
    </>
  );
}

export default SaveAsMenuItem;
