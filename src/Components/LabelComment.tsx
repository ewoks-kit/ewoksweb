import { useEffect, useState } from 'react';

import type { EwoksRFLink } from '../types';
import { FormControl, TextField } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import SidebarTooltip from './SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import TextButtonSave from './TextButtonSave';

const useStyles = DashboardStyle;

// DOC: the label and comment for nodes-links when selected
export default function LabelComment(props) {
  const classes = useStyles();

  const { element, showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState('');
  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);
  const setSelectedElement = state((state) => state.setSelectedElement);

  useEffect(() => {
    // console.log('rerender');
    if ('position' in element) {
      setLabel(element.data.label);
      setComment(element.data.comment);
    } else if ('source' in element) {
      const el = element as EwoksRFLink;
      setLabel(el.label);
      setComment(el.data && el.data.comment);

      const mappings =
        el.data.data_mapping.length > 0
          ? el.data.data_mapping
              .map((con) => `${con.source_output}->${con.target_input}`)
              .join(', ')
          : '';
      const conditions =
        el.data.conditions.length > 0
          ? el.data.conditions
              .map(
                (con) => `${con.source_output}: ${JSON.stringify(con.value)}`
              )
              .join(', ')
          : '';

      setLabelChoices([mappings, conditions, '...']);
    }
  }, [element]);

  function saveLabel(labelLocal) {
    // console.log('save', element, labelLocal);
    if ('position' in element) {
      const el = element;
      setSelectedElement(
        {
          ...el,
          label: labelLocal,
          data: { ...element.data, label: labelLocal },
        },
        'fromSaveElement'
      );
    } else {
      setSelectedElement(
        {
          ...element,
          label: labelLocal,
        },
        'fromSaveElement'
      );
    }
  }

  function saveComment(commentLocal) {
    const el = element as EwoksRFLink;
    setSelectedElement(
      {
        ...el,
        data: { ...element.data, comment: commentLocal },
      },
      'fromSaveElement'
    );
  }

  return (
    <div className={classes.detailsLabels}>
      {Object.keys(element).includes('source') ? (
        <SidebarTooltip text="Use Conditions or Data Mapping as label.">
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={labelChoices}
              value={label}
              onChange={(event, newValue: string | null) => {
                setSelectedElement(
                  {
                    ...element,
                    label: newValue,
                  },
                  'fromSaveElement'
                );
              }}
              onInputChange={(event, newInputValue) => {
                setSelectedElement(
                  {
                    ...element,
                    label: newInputValue,
                  },
                  'fromSaveElement'
                );
              }}
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
