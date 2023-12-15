import { useState } from 'react';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../api/tasks';
import { useWorkflowDLE } from '../api/workflows';
import useFetchingWorkflow from '../store/useFetchingWorkflow';
import useSnackbarStore from '../store/useSnackbarStore';
import useStore from '../store/useStore';
import type { WorkflowDescription } from '../types';
import ConfirmDialog from './ConfirmDialog';
import useQuickOpenStore from './useQuickOpenStore';
import WorkflowDropdown from './WorkflowDropdown';

export default function QuickOpen() {
  const [workflowId, setWorkflowId] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);

  const rfInstance = useReactFlow();
  const tasks = useTasks();
  const { setFetching } = useFetchingWorkflow();

  const { refetch } = useWorkflowDLE();

  async function setInputValue(workflowDetails: WorkflowDescription) {
    if (workflowDetails.id) {
      setWorkflowId(workflowDetails.id);
      getFromServer(workflowDetails.id);
    }

    setOpenAgreeDialog(false);
  }

  async function getFromServer(workflowIdparam: string) {
    if (workflowIdparam) {
      setFetching(true);
      // const workflow = await getWorkflow(workflowIdparam);
      // setRootWorkflow(workflow, rfInstance, tasks, 'fromServer');
      const { data: inData } = await refetch({
        queryKey: ['workflow', workflowIdparam],
      });
      if (inData) {
        const workflow = await inData(workflowIdparam);
        setRootWorkflow(workflow, rfInstance, tasks, 'fromServer');
      }
      setFetching(false);
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
