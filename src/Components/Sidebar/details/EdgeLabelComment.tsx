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

  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  useEffect(() => {
    const mappings =
      edgeData.data_mapping && edgeData.data_mapping.length > 0
        ? edgeData.data_mapping
            .map(
              (con) =>
                `${con.name?.toString() || ''}->${con.value?.toString() || ''}`
            )
            .join(', ')
        : '';
    const conditions =
      edgeData.conditions && edgeData.conditions.length > 0
        ? edgeData.conditions
            .map((con) => `${con.name || ''}: ${JSON.stringify(con.value)}`)
            .join(', ')
        : '';

    setLabelChoices([mappings, conditions, 'text...']);
  }, [element, edgeData]);

  function saveLabel(labelLocal: string, elementL: EwoksRFLink) {
    setEdges([
      ...getEdges().filter((edge) => edge.id !== elementL.id),
      {
        ...elementL,
        label: labelLocal,
      },
    ]);
  }

  function handleValueSelectedChange(
    event: ChangeEvent<HTMLInputElement>,
    elementL: EwoksRFLink
  ) {
    if (event.target.textContent) {
      saveLabel(event.target.textContent, elementL);
    }
  }

  function handleValueChange(
    event: ChangeEvent<HTMLInputElement> | undefined,
    elementL: EwoksRFLink
  ) {
    if (!event) {
      return;
    }

    if (event.target.value) {
      saveLabel(event.target.value, elementL);
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
              value={element.label}
              onChange={(event) =>
                handleValueSelectedChange(
                  event as ChangeEvent<HTMLInputElement>,
                  element
                )
              }
              onInputChange={(event) =>
                handleValueChange(
                  event as ChangeEvent<HTMLInputElement>,
                  element
                )
              }
              style={{ width: '98%' }}
              renderInput={(params) => (
                <TextField
                  // onBlur={() => saveLabel(element.label, element)}
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
          defaultValue={edgeData.comment}
          onValueSave={(newComment) => {
            mergeEdgeData(element.id, { comment: newComment });
          }}
        />
      </div>
    </div>
  );
}
