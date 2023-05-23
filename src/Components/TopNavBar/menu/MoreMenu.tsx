import { MenuList } from '@material-ui/core';
import useStore from '../../../store/useStore';
import UploadMenuItem from './UploadMenuItem';
import curateGraph from '../utils/curateGraph';
import { getEdgesData, getNodesData, rfToEwoks } from '../../../utils';
import type { EwoksRFLinkData, EwoksRFNodeData, GraphRF } from '../../../types';
import { useReactFlow } from 'reactflow';
import MoreMenuItem from './MoreMenuItem';
import { GetApp, FiberNew, Settings } from '@material-ui/icons';
import DiscoverMenuItem from './DiscoverMenuItem';

function download(content: BlobPart, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

interface Props {
  checkAndNewGraph: () => void;
  handleOpenSettings: () => void;
}

function MoreMenu(props: Props) {
  const { checkAndNewGraph, handleOpenSettings } = props;
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

  return (
    <MenuList>
      <MoreMenuItem
        icon={FiberNew}
        label="New workflow"
        onClick={checkAndNewGraph}
      />
      <UploadMenuItem />
      <MoreMenuItem icon={GetApp} label="Download" onClick={saveToDisk} />
      <DiscoverMenuItem />
      <MoreMenuItem
        icon={Settings}
        label="Settings"
        onClick={handleOpenSettings}
      />
    </MenuList>
  );
}

export default MoreMenu;
