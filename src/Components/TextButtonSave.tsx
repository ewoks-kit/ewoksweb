import React, { useEffect, useState } from 'react';

import { FormControl, IconButton, TextField, Fab } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import SaveIcon from '@material-ui/icons/Save';

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
    setValueIsChanged(false);
    props.valueSaved(val);
  }

  return (
    <div className={classes.detailsLabels}>
      <FormControl
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
        }}
        fullWidth
        variant="outlined"
      >
        {/* <Grid container spacing={1} alignItems="flex-end">
        <Grid
          item
          xs={12}
          sm={12}
          md={valueIsChanged ? 9 : 12}
          lg={valueIsChanged ? 10 : 12}
        > */}
        <TextField
          id="outlined-basic"
          label={label}
          variant="outlined"
          value={valueLocal || ''}
          style={{ width: valueIsChanged ? '80%' : '98%' }}
          onChange={valueChanged}
          multiline
        />
        {/* </Grid> */}
        {valueIsChanged && (
          // <Grid item xs={12} sm={12} md={3} lg={2}>
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
              // disabled={inExecutionMode}
            >
              <SaveIcon />
            </Fab>
          </IconButton>
          // </Grid>
        )}
        {/* </Grid> */}
      </FormControl>
    </div>
  );
}
