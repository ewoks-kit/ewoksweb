import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import useStore from '../../../store/useStore';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useReactFlow } from 'reactflow';
import type { Edge } from 'reactflow';
import { useState } from 'react';

export default function LinkSidebarMenu(selectedElement: Edge) {
  const rfInstance = useReactFlow();

  const graphInfo = useStore((state) => state.graphInfo);
  const workingGraph = useStore((state) => state.workingGraph);
  const [cannotDelete] = useState<boolean>(
    workingGraph.graph.id !== graphInfo.id
  );

  async function deleteLink(islink: Edge) {
    const edge: Edge | undefined = rfInstance
      .getEdges()
      .find((edg) => edg.id === islink.id);

    rfInstance.deleteElements({ edges: [edge] as Edge[] });
  }

  return (
    <MenuItem
      onClick={() => {
        deleteLink(selectedElement);
      }}
      role="sidebarMenuItem"
      disabled={cannotDelete}
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Delete Link</ListItemText>
      <Typography variant="body2" color="primary" />
    </MenuItem>
  );
}
