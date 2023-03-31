import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { FormControl, TextField, IconButton, Fab } from '@material-ui/core';
import DashboardStyle from '../../Dashboard/DashboardStyle';
import SidebarTooltip from '../SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import TextButtonSave from './TextButtonSave';
import SaveIcon from '@material-ui/icons/Save';
import sidebarStyle from '../sidebarStyle';
import { assertElementIsEdge, isString } from '../../../utils/typeGuards';
import { useReactFlow } from 'reactflow';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import { useSelectedElement } from '../../../store/graph-hooks';
import type { EwoksRFLink } from '../../../types';

const useStyles = DashboardStyle;

interface LabelCommentProps {
  showComment: boolean;
}

// DOC: the label and comment for links when selected
export default function EdgeLabelComment(props: LabelCommentProps) {
  const classes = useStyles();

  const { getEdges, setEdges } = useReactFlow();
  const element = useSelectedElement();
  assertElementIsEdge(element);
  const { showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState<string>('');
  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  useEffect(() => {
    const { label: elmtLabel } = element;
    if (isString(elmtLabel)) {
      setLabel(elmtLabel);
    }
    setComment(edgeData?.comment || '');

    const mappings =
      edgeData?.data_mapping && edgeData.data_mapping.length > 0
        ? edgeData.data_mapping
            .map(
              (con) => `${con.source_output || ''}->${con.target_input || ''}`
            )
            .join(', ')
        : '';
    const conditions =
      edgeData?.conditions && edgeData.conditions.length > 0
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
      ...getEdges().filter((edge) => edge.id !== element.id),
      {
        ...elementL,
        label: labelLocal,
      },
    ]);
  }

  function saveComment(commentLocal: string, elementL: EwoksRFLink) {
    mergeEdgeData(elementL.id, { comment: commentLocal });
  }

  function valueSavedLocal(labelL: string, elementL: EwoksRFLink) {
    setValueIsChanged(false);
    saveLabel(labelL, elementL);
  }

  function setChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event && label !== event.target.value) {
      setValueIsChanged(true);
    } else {
      setValueIsChanged(false);
    }
  }

  function valueSelectedChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.textContent) {
      setChanged(event);
      setLabel(event.target.textContent);
    }
  }

  function valueChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value) {
      setChanged(event);
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
              onInputChange={(event) =>
                valueChanged(event as ChangeEvent<HTMLInputElement>)
              }
              style={{ width: valueIsChanged ? '80%' : '98%' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Label"
                  margin="normal"
                  variant="outlined"
                  multiline
                />
              )}
            />
            {valueIsChanged && (
              <IconButton
                style={{ width: '20%', minWidth: '30px' }}
                color="inherit"
                onClick={() => valueSavedLocal(label, element)}
              >
                <Fab
                  className={classes.openFileButton}
                  color="primary"
                  size="small"
                  component="span"
                  aria-label="saveLabelComment"
                  // disabled={inExecutionMode}
                >
                  <SaveIcon />
                </Fab>
              </IconButton>
            )}
          </FormControl>
        </SidebarTooltip>
      )}

      <div style={{ display: showComment ? 'block' : 'none' }}>
        <TextButtonSave
          label="Comment"
          value={comment}
          valueSaved={() => saveComment(comment, element)}
        />
      </div>
    </div>
  );
}
