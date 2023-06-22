import useStore from '../../../store/useStore';
import type { EwoksRFLinkData, EwoksRFNodeData, GraphRF } from '../../../types';
import { useReactFlow } from 'reactflow';
import { GetApp } from '@material-ui/icons';
import { getEdgesData, getNodesData, rfToEwoks } from '../../../utils';
import curateGraph from '../utils/curateGraph';
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

  const graphInfo = useStore((state) => state.graphInfo);

  function saveToDisk() {
    if (graphInfo.label) {
      const { newNodesData, newEdgesData } = curateGraph(
        getNodesData(),
        getEdgesData()
      );

      const graphRf: GraphRF = {
        graph: graphInfo,
        nodes: getNodes().map((nod) => {
          return {
            ...nod,
            data: newNodesData.get(nod.id) as EwoksRFNodeData,
          };
        }),
        links: getEdges().map((edge) => {
          return {
            ...edge,
            data: newEdgesData.get(edge.id) as EwoksRFLinkData,
          };
        }),
      };
      download(
        JSON.stringify(rfToEwoks(graphRf), null, 2),
        `${graphInfo.label}.json`,
        'text/plain'
      );
    }
  }

  return <ActionMenuItem icon={GetApp} label="Download" onClick={saveToDisk} />;
}

export default DownloadMenuItem;
