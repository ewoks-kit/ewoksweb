import { FiberNew } from '@material-ui/icons';
import { useKeyboardEvent } from '@react-hookz/web';
import { useCallback, useState } from 'react';
import { useReactFlow } from 'reactflow';

import ConfirmDialog from '../../../general/ConfirmDialog';
import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [openDialog, setOpenDialog] = useState(false);

  const rfInstance = useReactFlow();
  const initGraph = useStore((state) => state.initGraph);
  const initializedGraph = useStore((state) => state.initializedGraph);

  const openEmptyWorkflow = useCallback(() => {
    initGraph(initializedGraph, undefined, rfInstance);
  }, [initGraph, initializedGraph, rfInstance]);

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
