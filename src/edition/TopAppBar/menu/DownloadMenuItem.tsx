import { GetApp } from '@mui/icons-material';
import { useReactFlow } from '@xyflow/react';

import useStore from '../../../store/useWorkflowStore';
import { getEdgesData, getNodesData, toEwoksWorkflow } from '../../../utils';
import ActionMenuItem from './ActionMenuItem';

function download(content: BlobPart, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

function DownloadMenuItem() {
  const { getNodes, getEdges } = useReactFlow();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  function saveToDisk() {
    const workflow = toEwoksWorkflow(
      displayedWorkflowInfo,
      getNodes(),
      getEdges(),
      getNodesData(),
      getEdgesData(),
    );
    download(
      JSON.stringify(workflow, null, 2),
      `${displayedWorkflowInfo.id}.json`,
      'text/plain',
    );
  }

  return <ActionMenuItem icon={GetApp} label="Download" onClick={saveToDisk} />;
}

export default DownloadMenuItem;
