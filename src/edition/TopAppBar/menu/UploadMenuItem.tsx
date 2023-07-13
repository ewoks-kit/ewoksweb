import { useRef } from 'react';
import { FolderOpen } from '@material-ui/icons';

import useStore from '../../../store/useStore';
import ActionMenuItem from './ActionMenuItem';
import OpenGraphInput from '../../../general/OpenGraphInput';

function UploadMenuItem() {
  const ref = useRef<HTMLInputElement>(null);

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);

  return (
    <ActionMenuItem
      onClick={() => {
        setGraphOrSubgraph(true);
        ref.current?.click();
      }}
      icon={FolderOpen}
      label="Open from disk"
    >
      <OpenGraphInput ref={ref} />
    </ActionMenuItem>
  );
}

export default UploadMenuItem;
