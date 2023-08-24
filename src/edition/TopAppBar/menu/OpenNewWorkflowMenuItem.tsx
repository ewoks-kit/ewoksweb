import { FiberNew } from '@material-ui/icons';
import { useKeyboardEvent } from '@react-hookz/web';
import { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';

import ConfirmDialog from '../../../general/ConfirmDialog';
import useStore from '../../../store/useStore';
import { EMPTY_GRAPH } from '../../../utils/emptyGraphs';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);
  const tasks = useStore((state) => state.tasks);

  const rfInstance = useReactFlow();
  const setWorkingGraph = useStore((state) => state.setWorkingGraph);

  const openEmptyWorkflow = useCallback(() => {
    setOpenDialog(false);
    setWorkingGraph(EMPTY_GRAPH, rfInstance, tasks);
  }, [setWorkingGraph, rfInstance, tasks]);

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n',
    (e) => {
      e.preventDefault();
      setOpenDialog(true);
    },
    []
  );

  return (
    <>
      <ConfirmDialog
        title="Open a new workflow"
        content="All unsaved modifications will be lost. Continue?"
        open={openDialog}
        agreeCallback={openEmptyWorkflow}
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
