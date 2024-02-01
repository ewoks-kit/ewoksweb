import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import useSnackbarStore from '../store/useSnackbarStore';
import type { WorkflowDescription } from '../types';
import ConfirmDialog from './ConfirmDialog';
import useQuickOpenStore from './useQuickOpenStore';
import WorkflowDropdown from './WorkflowDropdown';

export default function QuickOpen() {
  const [workflowId, setWorkflowId] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);

  const [, setQueryParams] = useSearchParams();

  async function setInputValue(workflowDetails: WorkflowDescription) {
    if (workflowDetails.id) {
      setWorkflowId(workflowDetails.id);
      getFromServer(workflowDetails.id);
    }

    setOpenAgreeDialog(false);
  }

  async function getFromServer(workflowIdParam: string) {
    if (workflowIdParam) {
      setQueryParams({ workflow: workflowIdParam });
    } else {
      showWarningMsg('Please select a graph to fetch and re-click!');
    }
  }

  const setElement = useQuickOpenStore((state) => state.setElement);

  return (
    <>
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        setOpen={setOpenAgreeDialog}
        agreeCallback={() => getFromServer(workflowId)}
        disagreeCallback={() => setOpenAgreeDialog(false)}
      />
      <WorkflowDropdown
        ref={(elem) => setElement(elem ?? undefined)}
        key={workflowId}
        onChange={(workflowDetails) => {
          setInputValue(workflowDetails);
        }}
      />
    </>
  );
}
