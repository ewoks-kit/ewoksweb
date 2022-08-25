import React, { useEffect } from 'react';

import type { EwoksRFLink } from '../types';
import { Box, Button, TextField } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import SidebarTooltip from './SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';

const useStyles = DashboardStyle;

// DOC: the label and comment for nodes-links when selected
export default function LabelComment(props) {
  const classes = useStyles();

  const { element, showComment } = props;

  const [comment, setComment] = React.useState('');
  const [label, setLabel] = React.useState('');
  const [labelChoices, setLabelChoices] = React.useState([
    'use mappings',
    'use conditions',
  ]);
  const setSelectedElement = state((state) => state.setSelectedElement);

  useEffect(() => {
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

  const labelChanged = (event) => {
    setLabel(event.target.value);

    if ('position' in element) {
      const el = element;
      setSelectedElement(
        {
          ...el,
          label: event.target.value,
          data: { ...element.data, label: event.target.value },
        },
        'fromSaveElement'
      );
    } else {
      setSelectedElement(
        {
          ...element,
          label: event.target.value,
        },
        'fromSaveElement'
      );
    }
  };

  const commentChanged = (event) => {
    // console.log('comment changed:', event.target.value);
    setComment(event.target.value);
    const el = element;
    setSelectedElement(
      {
        ...el,
        data: { ...element.data, comment: event.target.value },
      },
      'fromSaveElement'
    );
  };

  return (
    <>
      <div className={classes.detailsLabels}>
        <Box>
          {Object.keys(element).includes('source') ? (
            <SidebarTooltip text="Use Conditions or Data Mapping as label.">
              <Autocomplete
                id="free-solo-demo"
                freeSolo
                options={labelChoices}
                value={label}
                onChange={(event, newValue: string | null) => {
                  console.log(newValue);
                  setSelectedElement(
                    {
                      ...element,
                      label: newValue,
                    },
                    'fromSaveElement'
                  );
                }}
                onInputChange={(event, newInputValue) => {
                  console.log(newInputValue);
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
                  />
                )}
              />
            </SidebarTooltip>
          ) : (
            <TextField
              id="outlined-basic"
              label="Label"
              variant="outlined"
              value={label || ''}
              onChange={labelChanged}
              multiline
            />
          )}
        </Box>
      </div>
      <div style={{ display: showComment ? 'block' : 'none' }}>
        <Box>
          <TextField
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            value={comment || ''}
            onChange={commentChanged}
            multiline
          />
        </Box>
      </div>
    </>
  );
}
