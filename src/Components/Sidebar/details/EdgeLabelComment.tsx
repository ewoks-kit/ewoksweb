import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FormControl, TextField } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import SidebarTooltip from '../SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import TextButtonSave from './TextButtonSave';
import sidebarStyle from '../sidebarStyle';
import {
  assertEdgeDataDefined,
  assertElementIsEdge,
  isString,
} from '../../../utils/typeGuards';
import { useReactFlow } from 'reactflow';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { useSelectedElement } from '../../../store/graph-hooks';
import type { EwoksRFLink } from '../../../types';

// DOC: the label and comment for links when selected
export default function EdgeLabelComment() {
  const classes = useDashboardStyles();

  const { getEdges, setEdges } = useReactFlow();
  const element = useSelectedElement();
  assertElementIsEdge(element);

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState<string>('');
  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  useEffect(() => {
    const { label: elmtLabel } = element;
    if (isString(elmtLabel)) {
      setLabel(elmtLabel);
    }

    setComment(edgeData.comment || '');
    const mappings =
      edgeData.data_mapping && edgeData.data_mapping.length > 0
        ? edgeData.data_mapping
            .map(
              (con) =>
                `${con.source_output?.toString() || ''}->${
                  con.target_input?.toString() || ''
                }`
            )
            .join(', ')
        : '';
    const conditions =
      edgeData.conditions && edgeData.conditions.length > 0
        ? edgeData.conditions
            .map(
              (con) =>
                `${con.source_output || ''}: ${JSON.stringify(con.value)}`
            )
            .join(', ')
        : '';

    setLabelChoices([mappings, conditions, 'text...']);
  }, [element, edgeData]);

  function saveLabel(labelLocal: string, elementL: EwoksRFLink) {
    setEdges([
      ...getEdges().filter((edge) => edge.id !== element?.id),
      {
        ...elementL,
        label: labelLocal,
      },
    ]);
  }

  function valueSavedLocal(labelL: string, elementL: EwoksRFLink) {
    saveLabel(labelL, elementL);
  }

  function valueSelectedChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.textContent) {
      setLabel(event.target.textContent);
    }
  }

  function valueChanged(event: ChangeEvent<HTMLInputElement> | undefined) {
    if (!event) {
      return;
    }

    if (event.target.value) {
      setLabel(event.target.value);
    }
  }

  return (
    <div className={classes.detailsLabels}>
      {Object.keys(element).includes('source') && (
        <SidebarTooltip text="Use Conditions or Data Mapping as label.">
          <FormControl
            fullWidth
            variant="outlined"
            style={{ ...sidebarStyle.formstyleflex }}
          >
            <Autocomplete
              freeSolo
              options={labelChoices}
              value={label}
              onChange={(event) =>
                valueSelectedChanged(event as ChangeEvent<HTMLInputElement>)
              }
              // onBlur={() => valueSavedLocal(label, element)}
              onInputChange={(event) =>
                valueChanged(event as ChangeEvent<HTMLInputElement>)
              }
              style={{ width: '98%' }}
              renderInput={(params) => (
                <TextField
                  onBlur={() => valueSavedLocal(label, element)}
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
        <TextButtonSave
          label="Comment"
          value={comment}
          valueSaved={(newComment) => {
            mergeEdgeData(element.id, { comment: newComment });
          }}
        />
      </div>
    </div>
  );
}
