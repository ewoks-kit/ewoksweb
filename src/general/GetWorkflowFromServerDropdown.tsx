import { useState } from 'react';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../api/tasks';
import { useWorkflowDLE } from '../api/workflows';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import type { WorkflowDescription } from '../types';
import ConfirmDialog from './ConfirmDialog';
import WorkflowDropdown from './WorkflowDropdown';

export default function GetWorkflowFromServerDropdown() {
  const [workflowId, setWorkflowId] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);

  const rfInstance = useReactFlow();
  const tasks = useTasks();

  const { refetch } = useWorkflowDLE(workflowId);

  async function setInputValue(workflowDetails: WorkflowDescription) {
    if (workflowDetails.id) {
      setWorkflowId(workflowDetails.id);
      getFromServer(workflowDetails.id);
    }

    setOpenAgreeDialog(false);
  }

  async function getFromServer(workflowIdparam: string) {
    if (workflowIdparam) {
      const { data: inData } = await refetch({
        queryKey: ['workflow', workflowIdparam],
      });

      if (inData) {
        setRootWorkflow(
          await inData(workflowIdparam),
          rfInstance,
          tasks,
          'fromServer',
        );
      }
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
        key={workflowId}
        onChange={(workflowDetails) => {
          setInputValue(workflowDetails);
        }}
      />
    </>
  );
}
