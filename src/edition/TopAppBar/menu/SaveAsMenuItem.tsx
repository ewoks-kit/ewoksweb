import { FileCopy } from '@mui/icons-material';
import { useState } from 'react';

import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import useStore from '../../../store/useStore';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import ActionMenuItem from './ActionMenuItem';

function SaveAsMenuItem() {
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

      <ActionMenuItem
        onClick={() => setOpenSaveDialog(true)}
        label="Save as..."
        icon={FileCopy}
        disabled={
          !rootWorkflowId || rootWorkflowId !== displayedWorkflowInfo.id
        }
      />
    </>
  );
}

export default SaveAsMenuItem;
