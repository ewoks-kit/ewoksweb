import { FolderOpen } from '@mui/icons-material';
import { useReactFlow } from '@xyflow/react';
import { useRef } from 'react';

import { useTasks } from '../../../api/tasks';
import OpenGraphInput from '../../../general/OpenGraphInput';
import useStore from '../../../store/useStore';
import { WorkflowSource } from '../../../types';
import ActionMenuItem from './ActionMenuItem';

function UploadMenuItem() {
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();
  const tasks = useTasks();

  const setRootWorkflow = useStore((state) => state.setRootWorkflow);

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
          setRootWorkflow(graph, rfInstance, tasks, WorkflowSource.Disk);
        }}
        label="Load workflow from disk"
      />
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
