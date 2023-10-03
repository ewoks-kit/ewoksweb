import { useState } from 'react';

import useStore from '../store/useStore';
import useSnackbarStore from '../store/useSnackbarStore';
import type { WorkflowDescription } from '../types';
import ConfirmDialog from './ConfirmDialog';
import WorkflowDropdown from './WorkflowDropdown';
import { fetchWorkflow } from '../api/workflows';
import { useReactFlow } from 'reactflow';
import { useTasks } from '../api/tasks';

export default function GetWorkflowFromServerDropdown() {
  const [workflowId, setWorkflowId] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);

  const rfInstance = useReactFlow();
  const tasks = useTasks();

  async function setInputValue(workflowDetails: WorkflowDescription) {
    if (workflowDetails.id) {
      setWorkflowId(workflowDetails.id);
      getFromServer(workflowDetails.id);
    }

    setOpenAgreeDialog(false);
  }

  async function getFromServer(workflowIdparam: string) {
    if (workflowIdparam) {
      const { data: graph } = await fetchWorkflow(workflowIdparam);
      setRootWorkflow(graph, rfInstance, tasks, 'fromServer');
    } else {
      showWarningMsg('Please select a graph to fetch and re-click!');
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
      <WorkflowDropdown
        onChange={(workflowDetails) => {
          setInputValue(workflowDetails);
        }}
        style={{
          minWidth: '220px',
          backgroundColor: '#7685dd',
          borderRadius: '4px',
        }}
      />
    </>
  );
}
