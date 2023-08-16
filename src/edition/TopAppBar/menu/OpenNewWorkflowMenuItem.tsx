import { FiberNew } from '@material-ui/icons';
import { useKeyboardEvent } from '@react-hookz/web';
import { useState } from 'react';
import { useReactFlow } from 'reactflow';

import ConfirmDialog from '../../../general/ConfirmDialog';
import useCurrentWorkflowIdStore from '../../../store/useCurrentWorkflowId';
import useStore from '../../../store/useStore';
import { EMPTY_GRAPH } from '../../../utils/emptyGraphs';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);

  const rfInstance = useReactFlow();
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const resetCurrentWorkflowId = useCurrentWorkflowIdStore(
    (state) => state.resetId
  );

  function openEmptyWorkflow() {
    setOpenDialog(false);
    resetCurrentWorkflowId();
    setWorkingGraph(EMPTY_GRAPH, rfInstance.setNodes, rfInstance.setEdges);
  }

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n',
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpenDialog(true);
    },
    [openEmptyWorkflow]
  );

  return (
    <>
      <ConfirmDialog
        title="Open a new workflow"
        content="All unsaved modifications will be lost. Continue?"
        open={openDialog}
        agreeCallback={() => openEmptyWorkflow()}
        disagreeCallback={() => setOpenDialog(false)}
      />
      <ActionMenuItem
        icon={FiberNew}
        label="New workflow"
        onClick={() => setOpenDialog(true)}
      />
    </>
  );
}

export default OpenNewWorkflowMenuItem;
