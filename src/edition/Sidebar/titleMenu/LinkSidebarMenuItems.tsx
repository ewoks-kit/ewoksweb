import { Delete as DeleteIcon } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';

import useStore from '../../../store/useStore';
import KeyStrokeHint from '../../KeyStrokeHint';

interface Props {
  link: Edge;
  onSelection: () => void;
}

export default function LinkSidebarMenuItems(props: Props) {
  const { link, onSelection } = props;

  const rfInstance = useReactFlow();

  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  return (
    <MenuItem
      onClick={() => {
        const edge = rfInstance.getEdges().find((edg) => edg.id === link.id);

        if (edge) {
          rfInstance.deleteElements({ edges: [edge] });
        }
        onSelection();
      }}
      disabled={rootWorkflowId !== displayedWorkflowInfo.id}
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Delete Link</ListItemText>
      <KeyStrokeHint text="Del" />
    </MenuItem>
  );
}
