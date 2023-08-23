import { useRef } from 'react';
import { FolderOpen } from '@material-ui/icons';

import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';
import OpenGraphInput from '../../../general/OpenGraphInput';
import { useReactFlow } from 'reactflow';
import useCurrentWorkflowIdStore from '../../../store/useCurrentWorkflowId';

function UploadMenuItem() {
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();
  const tasks = useStore((state) => state.tasks);

  const setWorkingGraph = useStore((state) => state.setWorkingGraph);
  const resetCurrentWorkflowId = useCurrentWorkflowIdStore(
    (state) => state.resetId
  );

  return (
    <ActionMenuItem
      onClick={() => {
        ref.current?.click();
      }}
      icon={FolderOpen}
      label="Open from disk"
    >
      <OpenGraphInput
        ref={ref}
        onGraphLoad={(graph) => {
          resetCurrentWorkflowId();
          setWorkingGraph(graph, rfInstance, tasks, 'fromDisk');
        }}
      />
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
