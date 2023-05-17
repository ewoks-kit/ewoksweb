import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import { MenuList } from '@material-ui/core';
import useStore from '../../store/useStore';
import MenuUpload from '../General/MenuUpload';
import curateGraph from './utils/curateGraph';
import { getEdgesData, getNodesData, rfToEwoks } from '../../utils';
import type { EwoksRFLinkData, EwoksRFNodeData, GraphRF } from '../../types';
import { useReactFlow } from 'reactflow';
import MoreMenuItem from './MoreMenuItem';
import { GetApp, FiberNew, Settings } from '@material-ui/icons';

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

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

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const graphInfo = useStore((state) => state.graphInfo);

  function loadFromDisk() {
    setGraphOrSubgraph(true);
  }

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
      <MoreMenuItem icon={GetApp} label="Download" onClick={saveToDisk} />
      <StyledMenuItem onClick={loadFromDisk} role="menuitem">
        <MenuUpload />
      </StyledMenuItem>
      <MoreMenuItem
        icon={Settings}
        label="Workflows-Tasks-Icons"
        onClick={handleOpenSettings}
      />
    </MenuList>
  );
}

export default MoreMenu;
