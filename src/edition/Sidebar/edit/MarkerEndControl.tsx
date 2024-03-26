import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';

import styles from './EditLinkStyle.module.css';
import { MarkerEndOption } from './models';
import { markerEndOptionToRF, rfMarkerEndToOption } from './utils';

interface Props {
  element: Edge;
}

function MarkerEndControl(props: Props) {
  const { element } = props;

  const { setEdges, getEdges } = useReactFlow();

  function handleChange(event: SelectChangeEvent) {
    const { value: newValue } = event.target;
    const newEdge = {
      ...element,
      markerEnd: markerEndOptionToRF(newValue as MarkerEndOption),
    };

    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  function applyArrowTypeToAll() {
    const newEdges: Edge[] = getEdges().map((edge) => {
      return { ...edge, markerEnd: element.markerEnd };
    });
    setEdges(newEdges);
  }

  const value = rfMarkerEndToOption(element.markerEnd);

  return (
    <FormControl variant="filled" fullWidth className={styles.container}>
      <InputLabel id="markerEnd">Arrow Head</InputLabel>
      <Select
        className={styles.dropdown}
        variant="standard"
        value={value}
        label="Arrow head"
        onChange={handleChange}
      >
        {Object.values(MarkerEndOption).map((option) => (
          <MenuItem value={option} key={option}>
            {option}
          </MenuItem>
        ))}
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
