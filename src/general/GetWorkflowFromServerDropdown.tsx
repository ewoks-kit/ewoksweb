import { useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import useStore from '../store/useStore';
import type { WorkflowDescription } from '../types';
import ConfirmDialog from './ConfirmDialog';
import WorkflowDropdown from './WorkflowDropdown';
import useCurrentWorkflowIdStore from '../store/useCurrentWorkflowId';

export default function GetWorkflowFromServerDropdown() {
  const [workflowId, setWorkflowId] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const setCurrentWorkflowId = useCurrentWorkflowIdStore(
    (state) => state.setId
  );

  async function setInputValue(workflowDetails: WorkflowDescription) {
    if (workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
    }

    setOpenAgreeDialog(false);

    if (workflowDetails.id) {
      getFromServer(workflowDetails.id);
    }
  }

  async function getFromServer(workflowIdparam: string) {
    if (workflowIdparam) {
      setCurrentWorkflowId(workflowIdparam);
    } else {
      setOpenSnackbar({
        open: true,
        text: 'Please select a graph to fetch and re-click!',
        severity: 'warning',
      });
    }
  }

  return (
    <>
      <ConfirmDialog
        title="There are unsaved changes"
        content="Continue without saving?"
        open={openAgreeDialog}
        agreeCallback={() => getFromServer(workflowId)}
        disagreeCallback={() => setOpenAgreeDialog(false)}
      />
      <FormControl
        variant="standard"
        style={{
          minWidth: '220px',
          backgroundColor: '#7685dd',
          borderRadius: '4px',
        }}
      >
        <WorkflowDropdown
          onChange={(workflowDetails) => {
            setInputValue(workflowDetails);
          }}
        />
      </FormControl>
    </>
  );
}
