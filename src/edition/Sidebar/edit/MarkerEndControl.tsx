import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { useUpdateEdge } from '../../../general/hooks';
import styles from './EditLinkStyle.module.css';
import type { MarkerEndOption } from './models';
import { markerEndOptionToRF, rfMarkerEndToOption } from './utils';

interface Props {
  edge: Edge;
}

function MarkerEndControl(props: Props) {
  const { edge } = props;

  const { setEdges, getEdges } = useReactFlow();
  const updateEdge = useUpdateEdge();

  function handleChange(event: SelectChangeEvent<MarkerEndOption>) {
    const { value: newValue } = event.target;

    updateEdge({
      ...edge,
      markerEnd: markerEndOptionToRF(newValue as MarkerEndOption),
    });
  }

  function applyArrowTypeToAll() {
    const newEdges = getEdges().map((oldEdge) => {
      return { ...oldEdge, markerEnd: edge.markerEnd };
    });
    setEdges(newEdges);
  }

  const value = rfMarkerEndToOption(edge.markerEnd);

  return (
    <FormControl variant="filled" fullWidth className={styles.container}>
      <InputLabel id="markerEnd">Arrow Head</InputLabel>
      <Select
        className={styles.dropdown}
        variant="standard"
        value={value}
        label="Arrow head"
        onChange={handleChange}
        inputProps={{ 'aria-label': 'Arrow head' }}
      >
        <MenuItem value={MarkerType.Arrow}>{MarkerType.Arrow}</MenuItem>
        <MenuItem value={MarkerType.ArrowClosed}>
          {MarkerType.ArrowClosed}
        </MenuItem>
        <MenuItem value="none">none</MenuItem>
      </Select>
      <Button
        style={{ margin: '8px' }}
        variant="outlined"
        color="primary"
        onClick={() => applyArrowTypeToAll()}
        size="small"
      >
        Apply to all
      </Button>
    </FormControl>
  );
}

export default MarkerEndControl;
