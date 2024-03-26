import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type { Edge, EdgeMarkerType } from 'reactflow';
import { useReactFlow } from 'reactflow';
import { MarkerType } from 'reactflow';

import { isMarkerType, isString } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';

interface Props {
  element: Edge;
}

function getArrowType(
  markerEnd: EdgeMarkerType | undefined,
): MarkerType | 'none' {
  if (!markerEnd) {
    return 'none';
  }

  if (isString(markerEnd)) {
    return isMarkerType(markerEnd) ? markerEnd : 'none';
  }

  return markerEnd.type;
}

function MarkerEndControl(props: Props) {
  const { element } = props;
  const { setEdges, getEdges } = useReactFlow();

  const arrowType = getArrowType(element.markerEnd);

  function handleArrowTypeChange(event: SelectChangeEvent) {
    const type = event.target.value;
    if (!isString(type)) {
      return;
    }
    const newEdge = isMarkerType(type)
      ? { ...element, markerEnd: { type } }
      : { ...element, markerEnd: '' };

    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  function applyArrowTypeToAll() {
    const newEdges: Edge[] = getEdges().map((edge) => {
      if (arrowType === 'none') {
        return { ...edge, markerEnd: undefined };
      }
      return { ...edge, markerEnd: { type: arrowType } };
    });
    setEdges(newEdges);
  }
  return (
    <FormControl variant="filled" fullWidth style={sidebarStyle.formstyleflex}>
      <InputLabel id="markerEnd">Arrow Head</InputLabel>
      <Select
        variant="standard"
        value={arrowType}
        label="Arrow head"
        onChange={handleArrowTypeChange}
        style={sidebarStyle.dropdown}
      >
        {[...Object.values(MarkerType), 'none'].map((tex) => (
          <MenuItem value={tex} key={tex}>
            {tex}
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
