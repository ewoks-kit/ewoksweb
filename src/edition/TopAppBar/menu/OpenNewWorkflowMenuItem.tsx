import { FiberNew } from '@mui/icons-material';
import { useKeyboardEvent } from '@react-hookz/web';
import { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../../../api/tasks';
import ConfirmDialog from '../../../general/ConfirmDialog';
import useStore from '../../../store/useStore';
import { EMPTY_GRAPH } from '../../../utils/emptyGraphs';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);
  const tasks = useTasks();

  const rfInstance = useReactFlow();
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  const openEmptyWorkflow = useCallback(() => {
    rfInstance.setNodes([]);
    rfInstance.setEdges([]);
    setOpenDialog(false);
    setRootWorkflow(EMPTY_GRAPH, rfInstance, tasks);
  }, [setRootWorkflow, rfInstance, tasks]);

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n',
    (e) => {
      e.preventDefault();
      setOpenDialog(true);
    },
    [],
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
        onClick={() => displayedWorkflowInfo.id && setOpenDialog(true)}
        keyShortcut="ctrl+shift+n"
      />
    </>
  );
}

export default OpenNewWorkflowMenuItem;
