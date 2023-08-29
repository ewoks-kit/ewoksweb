import { useRef } from 'react';
import { FolderOpen } from '@material-ui/icons';

import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';
import OpenGraphInput from '../../../general/OpenGraphInput';
import { useReactFlow } from 'reactflow';
import { useTasks } from '../../../api/tasks';

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
      />
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
