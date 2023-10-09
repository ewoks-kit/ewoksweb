import { Delete as DeleteIcon } from '@material-ui/icons';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';

import useStore from '../../../store/useStore';

export default function LinkSidebarMenu(selectedElement: Edge) {
  const rfInstance = useReactFlow();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

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
      disabled={rootWorkflowId !== displayedWorkflowInfo.id}
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Delete Link</ListItemText>
      <Typography variant="body2" color="primary" />
    </MenuItem>
  );
}
