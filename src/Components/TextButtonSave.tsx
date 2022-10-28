import React, { useEffect, useState } from 'react';

import { FormControl, IconButton, TextField, Fab } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import SaveIcon from '@material-ui/icons/Save';
import state from '../store/state';
// import SidebarTooltip from './SidebarTooltip';
// import { Autocomplete } from '@material-ui/lab';

const useStyles = DashboardStyle;

interface TextButtonSaveProps {
  label: string;
  value: string;
  valueSaved(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useStyles();

  const { label, value } = props;

  const [valueLocal, setValueLocal] = useState(value);
  const [valueIsChanged, setValueIsChanged] = useState(false);
  // const [labelChoices, setLabelChoices] = useState([
  //   'use mappings',
  //   'use conditions',
  // ]);
  const inExecutionMode = state((state) => state.inExecutionMode);

  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  function valueChanged(event) {
    if (value !== event.target.value) {
      setValueIsChanged(true);
    } else {
      setValueIsChanged(false);
    }

    setValueLocal(event.target.value);
  }

  function valueSavedLocal(val) {
    // console.log(val);
    setValueIsChanged(false);
    props.valueSaved(val);
  }

  return (
    <div className={classes.detailsLabels}>
      <FormControl
        className={classes.formStyleFlex}
        fullWidth
        variant="outlined"
      >
        {/* <SidebarTooltip text="Use Conditions or Data Mapping as label.">
          <FormControl fullWidth variant="outlined">
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              options={labelChoices}
              value={valueLocal}
              onChange={valueChanged}
              // onInputChange={valueChanged}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  margin="normal"
                  variant="outlined"
                  multiline
                />
              )}
            />
          </FormControl>
        </SidebarTooltip> */}

        <TextField
          id="outlined-basic"
          label={label}
          variant="outlined"
          value={valueLocal || ''}
          style={{ width: valueIsChanged ? '80%' : '98%' }}
          onChange={valueChanged}
          multiline
        />

        {valueIsChanged && (
          <IconButton
            style={{ width: '20%', minWidth: '40px' }}
            color="inherit"
            onClick={() => valueSavedLocal(valueLocal)}
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
    </div>
  );
}
