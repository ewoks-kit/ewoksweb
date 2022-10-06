import React, { useEffect, useState } from 'react';

import type { EwoksRFLink } from '../types';
import {
  FormControl,
  IconButton,
  InputLabel,
  OutlinedInput,
  TextField,
  Fab,
  InputAdornment,
  Grid,
} from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import SidebarTooltip from './SidebarTooltip';
import { Autocomplete } from '@material-ui/lab';
import useDebounce from '../hooks/useDebounce';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = DashboardStyle;

// DOC: the label and comment for nodes-links when selected
export default function LabelComment(props) {
  const classes = useStyles();

  const { element, showComment } = props;

  const [comment, setComment] = useState('');
  const [label, setLabel] = useState('');
  const [labelIsChanged, setLabelIsChanged] = useState(false);
  const [labelChoices, setLabelChoices] = useState([
    'use mappings',
    'use conditions',
  ]);
  const setSelectedElement = state((state) => state.setSelectedElement);

  const debouncedLabel = useDebounce(label, 1500);

  useEffect(() => {
    console.log('rerender');
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
    setLabelIsChanged(true);

    console.log(debouncedLabel);
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

  function save() {
    setLabelIsChanged(false);
    console.log('save', element);
    if ('position' in element) {
      const el = element;
      setSelectedElement(
        {
          ...el,
          label,
          data: { ...element.data, label },
        },
        'fromSaveElement'
      );
    } else {
      setSelectedElement(
        {
          ...element,
          label,
        },
        'fromSaveElement'
      );
    }
  }

  return (
    <>
      <div className={classes.detailsLabels}>
        {Object.keys(element).includes('source') ? (
          <SidebarTooltip text="Use Conditions or Data Mapping as label.">
            <FormControl
              fullWidth
              variant="outlined"
              className={classes.detailsLabels}
            >
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
          <FormControl
            fullWidth
            variant="outlined"
            className={classes.detailsLabels}
          >
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <TextField
                  id="outlined-basic"
                  label="Label"
                  variant="outlined"
                  value={label || ''}
                  onChange={labelChanged}
                  multiline
                />
              </Grid>
              {labelIsChanged && (
                <Grid item>
                  <IconButton color="inherit" onClick={save}>
                    <Fab
                      className={classes.openFileButton}
                      color="primary"
                      size="small"
                      component="span"
                      aria-label="add"
                      // disabled={inExecutionMode}
                    >
                      <SaveIcon />
                    </Fab>
                  </IconButton>
                </Grid>
              )}
            </Grid>
          </FormControl>
        )}
      </div>
      <div style={{ display: showComment ? 'block' : 'none' }}>
        <FormControl
          fullWidth
          variant="outlined"
          className={classes.detailsLabels}
        >
          <InputLabel htmlFor="outlined-comment">Comment</InputLabel>
          <OutlinedInput
            id="outlined-comment"
            value={comment || ''}
            onChange={commentChanged}
            labelWidth={60}
            multiline
          />
        </FormControl>
        {/* <TextField
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            value={comment || ''}
            onChange={commentChanged}
            multiline
          />
        </Box> */}
      </div>
    </>
  );
}
