import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { MenuList } from '@material-ui/core';
import useStore from '../../store/useStore';
import MenuUpload from '../General/MenuUpload';
import FiberNew from '@material-ui/icons/FiberNew';
import AssignmentReturnIcon from '@material-ui/icons/AssignmentReturn';
import SettingsIcon from '@material-ui/icons/Settings';
import curateGraph from './utils/curateGraph';
import { getEdgesData, getNodesData, rfToEwoks } from '../../utils';
import type { EwoksRFLinkData, EwoksRFNodeData, GraphRF } from '../../types';
import { useReactFlow } from 'reactflow';

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
      <StyledMenuItem onClick={checkAndNewGraph} role="menuitem">
        <ListItemIcon>
          <FiberNew fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="New workflow" />
      </StyledMenuItem>
      <StyledMenuItem onClick={saveToDisk} role="menuitem">
        <ListItemIcon>
          <AssignmentReturnIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Export to disk" />
      </StyledMenuItem>
      <StyledMenuItem onClick={loadFromDisk} role="menuitem">
        <MenuUpload />
      </StyledMenuItem>
      <StyledMenuItem onClick={handleOpenSettings} role="menuitem">
        <ListItemIcon>
          <SettingsIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Workflows-Tasks-Icons" />
      </StyledMenuItem>
    </MenuList>
  );
}

export default MoreMenu;
