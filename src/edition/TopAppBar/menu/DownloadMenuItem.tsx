import { GetApp } from '@material-ui/icons';
import { useReactFlow } from 'reactflow';

import useStore from '../../../store/useStore';
import { getEdgesData, getNodesData, prepareEwoksGraph } from '../../../utils';
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
    (state) => state.displayedWorkflowInfo
  );

  function saveToDisk() {
    const ewoksGraph = prepareEwoksGraph(
      displayedWorkflowInfo,
      getNodes(),
      getEdges(),
      getNodesData(),
      getEdgesData()
    );
    download(
      JSON.stringify(ewoksGraph, null, 2),
      `${displayedWorkflowInfo.label || 'Untitled'}.json`,
      'text/plain'
    );
  }

  return <ActionMenuItem icon={GetApp} label="Download" onClick={saveToDisk} />;
}

export default DownloadMenuItem;
