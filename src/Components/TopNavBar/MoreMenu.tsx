import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import type { MenuProps } from '@material-ui/core/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { MenuList } from '@material-ui/core';
import useStore from '../../store/useStore';
import MenuUpload from '../General/MenuUpload';
import FiberNew from '@material-ui/icons/FiberNew';
import SettingsIcon from '@material-ui/icons/Settings';
import curateGraph from './utils/curateGraph';
import { getEdgesData, getNodesData, rfToEwoks } from '../../utils';
import type { EwoksRFLinkData, EwoksRFNodeData, GraphRF } from '../../types';
import { useReactFlow } from 'reactflow';
import ArchiveIcon from '@material-ui/icons/Archive';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

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

export default function CustomizedMenus(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const { checkAndNewGraph, handleOpenSettings } = props;
  const { getNodes, getEdges } = useReactFlow();

  const setGraphOrSubgraph = useStore((state) => state.setGraphOrSubgraph);
  const graphInfo = useStore((state) => state.graphInfo);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <div>
      <Button
        aria-controls="navbar-dropdown-menu"
        aria-haspopup="true"
        variant="contained"
        color="primary"
        onClick={handleClick}
        style={{
          margin: '8px',
          borderRadius: '20px',
          minWidth: '30px',
          maxWidth: '40px',
        }}
      >
        <MoreVertIcon />
      </Button>

      <StyledMenu
        id="navbar-dropdown-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuList>
          <StyledMenuItem onClick={checkAndNewGraph} role="menuitem">
            <ListItemIcon>
              <FiberNew fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="New workflow" />
          </StyledMenuItem>
          <StyledMenuItem onClick={saveToDisk} role="menuitem">
            <ListItemIcon>
              <ArchiveIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Download to disk" />
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
      </StyledMenu>
    </div>
  );
}
