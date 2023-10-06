import { FolderOpen } from '@material-ui/icons';
import { useRef } from 'react';
import { useReactFlow } from 'reactflow';

import { useTasks } from '../../../api/tasks';
import OpenGraphInput from '../../../general/OpenGraphInput';
import useStore from '../../../store/useStore';
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
          setRootWorkflow(graph, rfInstance, tasks, 'fromDisk');
        }}
        label="Load workflow from disk"
      />
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
