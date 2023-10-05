import { FormControl, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { assertEdgeDataDefined, isDefined } from '../../../utils/typeGuards';
import styles from './Details.module.css';
import { conditionsToLabel, mappingToLabel } from './utils';

interface Props {
  element: Edge;
}

export default function EgdeLabelInput(props: Props) {
  const { element } = props;
  const { getEdges, setEdges } = useReactFlow();
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  function saveLabel(label: string) {
    setEdges([
      ...getEdges().filter((edge) => element.id !== edge.id),
      {
        ...element,
        label,
      },
    ]);
  }

  return (
    <div className={styles.entry}>
      <FormControl fullWidth variant="outlined">
        <Autocomplete
          freeSolo
          options={[
            mappingToLabel(edgeData.data_mapping),
            conditionsToLabel(edgeData.conditions),
          ].filter(isDefined)}
          value={element.label}
          onChange={(e, value) => {
            if (typeof value === 'string') {
              saveLabel(value);
            }
          }}
          onInputChange={(e, value) => saveLabel(value)}
          renderInput={(params) => (
            <TextField
              variant="outlined"
              margin="dense"
              {...params}
              label="Label"
              multiline
            />
          )}
        />
      </FormControl>
    </div>
  );
}
