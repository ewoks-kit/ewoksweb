import { useState } from 'react';

import FormControl from '@material-ui/core/FormControl';
import useStore from '../store/useStore';
import type { WorkflowDescription } from '../types';
import ConfirmDialog from './ConfirmDialog';
import WorkflowDropdown from './WorkflowDropdown';
import { fetchWorkflow } from '../api/workflows';
import { useReactFlow } from 'reactflow';
import { useTasks } from '../api/tasks';

interface Props {
  getSubgraph?: boolean | undefined;
  setSubgraphId?: (id: string) => void;
}

export default function GetWorkflowFromServerDropdown(props: Props) {
  const { getSubgraph, setSubgraphId } = props;
  const [workflowId, setWorkflowId] = useState('');
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  const rfInstance = useReactFlow();
  const tasks = useTasks();

  async function setInputValue(workflowDetails: WorkflowDescription) {
    if (getSubgraph && setSubgraphId) {
      setSubgraphId(workflowDetails.id);
      return;
    }

    if (workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
      getFromServer(workflowDetails.id);
    }

    setOpenAgreeDialog(false);
  }

  async function getFromServer(workflowIdparam: string) {
    if (workflowIdparam) {
      const { data: graph } = await fetchWorkflow(workflowIdparam);
      setWorkingGraph(graph, rfInstance, tasks, 'fromServer');
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
          getSubgraph={getSubgraph}
          onChange={(workflowDetails) => {
            setInputValue(workflowDetails);
          }}
        />
      </FormControl>
    </>
  );
}
