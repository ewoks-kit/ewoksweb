import { useRef } from 'react';
import { FolderOpen } from '@material-ui/icons';

import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';
import OpenGraphInput from '../../../general/OpenGraphInput';
import { useReactFlow } from 'reactflow';

function UploadMenuItem() {
  const ref = useRef<HTMLInputElement>(null);
  const rfInstance = useReactFlow();
  const initGraph = useStore((state) => state.initGraph);

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
          initGraph(graph, 'fromDisk', rfInstance);
        }}
      />
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
