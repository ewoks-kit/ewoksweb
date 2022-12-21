import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { EwoksRFLink, EwoksRFNode } from '../../types';
import { FormControl, TextField, IconButton, Fab } from '@material-ui/core';
import DashboardStyle from '../Dashboard/DashboardStyle';
import useStore from '../../store/useStore';
import SidebarTooltip from './SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import TextButtonSave from './TextButtonSave';
import SaveIcon from '@material-ui/icons/Save';
import sidebarStyle from './sidebarStyle';
import { isLink, isNode } from '../../utils/typeGuards';

const useStyles = DashboardStyle;

interface LabelCommentProps {
  element: EwoksRFNode | EwoksRFLink;
  showComment: boolean;
}

// DOC: the label and comment for nodes-links when selected
export default function LabelComment(props: LabelCommentProps) {
  const classes = useStyles();

  const { element, showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState('');
  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const inExecutionMode = useStore((state) => state.inExecutionMode);

  useEffect(() => {
    if (isNode(element)) {
      setLabel(element.data.label);
      setComment(element.data?.comment);
      return;
    }

    if (isLink(element)) {
      setLabel(element.label);
      setComment(element.data?.comment);

      const mappings =
        element.data.data_mapping.length > 0
          ? element.data.data_mapping
              .map((con) => `${con.source_output}->${con.target_input}`)
              .join(', ')
          : '';
      const conditions =
        element.data.conditions.length > 0
          ? element.data.conditions
              .map(
                (con) => `${con.source_output}: ${JSON.stringify(con.value)}`
              )
              .join(', ')
          : '';

      setLabelChoices([mappings, conditions, 'text...']);
      return;
    }

    throw new Error('No link or Node tries to access LabelComment');
  }, [element]);

  function saveLabel(labelLocal: string) {
    // TODO: do not put label in both places. See the final spec of
    // ewoks labels-nodes and handle label-comment in a different way.
    setSelectedElement(
      {
        ...element,
        label: labelLocal,
        data: { ...element.data, label: labelLocal },
      },
      'fromSaveElement'
    );
  }

  function saveComment(commentLocal: string) {
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, comment: commentLocal },
      },
      'fromSaveElement'
    );
  }

  function valueSavedLocal() {
    setValueIsChanged(false);
    saveLabel(label);
  }

  function setChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event && label !== event.target.value) {
      setValueIsChanged(true);
    } else {
      setValueIsChanged(false);
    }
  }

  function valueSelectedChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event?.target.textContent) {
      setChanged(event);
      setLabel(event.target.textContent);
    }
  }

  function valueChanged(event: ChangeEvent<HTMLInputElement>) {
    if (event?.target?.value) {
      // event.target.value !== 0
      setChanged(event);
      setLabel(event.target.value);
    }
  }

  return (
    <div className={classes.detailsLabels}>
      {Object.keys(element).includes('source') ? (
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
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                valueSelectedChanged(event)
              }
              onInputChange={(event: ChangeEvent<HTMLInputElement>) =>
                valueChanged(event)
              }
              style={{ width: valueIsChanged ? '80%' : '98%' }}
              renderInput={(params) => (
                <TextField
                  data-cy="node-edge-label"
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
                onClick={valueSavedLocal}
                data-cy="saveLabelComment"
              >
                <Fab
                  className={classes.openFileButton}
                  color="primary"
                  size="small"
                  component="span"
                  aria-label="add"
                  disabled={inExecutionMode}
                >
                  <SaveIcon />
                </Fab>
              </IconButton>
            )}
          </FormControl>
        </SidebarTooltip>
      ) : (
        <TextButtonSave label="Label" value={label} valueSaved={saveLabel} />
      )}

      <div style={{ display: showComment ? 'block' : 'none' }}>
        <TextButtonSave
          label="Comment"
          value={comment}
          valueSaved={saveComment}
        />
      </div>
    </div>
  );
}
