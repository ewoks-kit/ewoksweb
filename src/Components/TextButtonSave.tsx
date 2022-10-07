import React, { useEffect, useState } from 'react';

import {
  FormControl,
  IconButton,
  TextField,
  Fab,
  Grid,
} from '@material-ui/core';
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

  const { label, value, valueSaved } = props;

  const [valueLocal, setValueLocal] = useState(value);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useEffect(() => {
    console.log('rerender');
    // if ('position' in element) {
    //   setLabel
    setValueLocal(value);
  }, [value]);

  function valueChanged(event) {
    console.log(event.target.value, valueLocal);

    if (value !== event.target.value) {
      setValueIsChanged(true);
    } else {
      setValueIsChanged(false);
    }

    setValueLocal(event.target.value);
  }

  function valueSavedLocal(val) {
    setValueIsChanged(false);
    valueSaved(val);
  }

  return (
    <FormControl fullWidth variant="outlined" className={classes.detailsLabels}>
      <Grid container spacing={1} alignItems="flex-end">
        <Grid
          item
          xs={12}
          sm={12}
          md={valueIsChanged ? 10 : 12}
          lg={valueIsChanged ? 10 : 12}
        >
          <TextField
            id="outlined-basic"
            label={label}
            variant="outlined"
            value={valueLocal || ''}
            style={{ width: '100%' }}
            onChange={valueChanged}
            multiline
          />
        </Grid>
        {valueIsChanged && (
          <Grid item xs={12} sm={12} md={2} lg={2}>
            <IconButton
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
          </Grid>
        )}
      </Grid>
    </FormControl>
  );
}
