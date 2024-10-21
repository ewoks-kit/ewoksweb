import { Delete as DeleteIcon } from '@mui/icons-material';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import type { Edge } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';

import KeyStrokeHint from '../../KeyStrokeHint';

interface Props {
  link: Edge;
  onSelection: () => void;
}

export default function LinkSidebarMenuItems(props: Props) {
  const { link, onSelection } = props;

  const rfInstance = useReactFlow();

  return (
    <MenuItem
      onClick={() => {
        const edge = rfInstance.getEdges().find((edg) => edg.id === link.id);

        if (edge) {
          rfInstance.deleteElements({ edges: [edge] });
        }
        onSelection();
      }}
    >
      <ListItemIcon>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Delete Link</ListItemText>
      <KeyStrokeHint text="Del" />
    </MenuItem>
  );
}
