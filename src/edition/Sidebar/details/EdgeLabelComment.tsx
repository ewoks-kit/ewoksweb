import { FormControl, TextField } from '@material-ui/core';
import SidebarTooltip from '../SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import InputTextField from './InputTextField';
import sidebarStyle from '../sidebarStyle';
import { assertEdgeDataDefined, isDefined } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';
import useEdgeDataStore from '../../../store/useEdgeDataStore';

import styles from './Details.module.css';
import { conditionsToLabel, mappingToLabel } from './utils';

interface Props {
  element: Edge;
}

// DOC: the label and comment for links when selected
export default function EdgeLabelComment(props: Props) {
  const { element } = props;
  const { getEdges, setEdges } = useReactFlow();
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

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
      {Object.keys(element).includes('source') && (
        <SidebarTooltip text="Use Conditions or Data Mapping as label.">
          <FormControl
            fullWidth
            variant="outlined"
            style={{ ...sidebarStyle.formstyleflex }}
          >
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
              style={{ width: '98%' }}
              renderInput={(params) => (
                <TextField
                  variant="outlined"
                  margin="dense"
                  style={{ margin: '0 0 8px 0', paddingTop: '2px' }}
                  {...params}
                  label="Label"
                  multiline
                />
              )}
            />
          </FormControl>
        </SidebarTooltip>
      )}

      <div style={{ display: 'block' }}>
        <InputTextField
          label="Comment"
          defaultValue={edgeData.comment}
          onValueSave={(newComment) => {
            mergeEdgeData(element.id, { comment: newComment });
          }}
        />
      </div>
    </div>
  );
}
