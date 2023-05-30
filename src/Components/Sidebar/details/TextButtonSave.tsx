import { useEffect, useState } from 'react';

import { FormControl, TextField } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import sidebarStyle from '../sidebarStyle';
import type { ChangeEvent } from 'react';

interface TextButtonSaveProps {
  label: string;
  value: string;
  valueSaved(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useDashboardStyles();

  const { label, value } = props;

  const [valueLocal, setValueLocal] = useState(value);
  const [valueIsChanged, setValueIsChanged] = useState(false);

  useEffect(() => {
    setValueLocal(value);
    setValueIsChanged(false);
  }, [value]);

  function valueChanged(event: ChangeEvent<HTMLInputElement>) {
    if (value !== event.target.value) {
      setValueIsChanged(true);
    } else {
      setValueIsChanged(false);
    }

    setValueLocal(event.target.value);
  }

  function valueSavedLocal() {
    setValueIsChanged(false);
    props.valueSaved(valueLocal);
  }

  return (
    <div className={classes.detailsLabels}>
      <FormControl
        style={{ ...sidebarStyle.formstyleflex }}
        fullWidth
        size="small"
      >
        <TextField
          label={label}
          variant="outlined"
          value={valueLocal || ''}
          margin="dense"
          style={{
            width: valueIsChanged ? '80%' : '98%',
            margin: '0 0 7px 0',
          }}
          onChange={valueChanged}
          onBlur={valueSavedLocal}
          multiline
          data-cy="node-edge-label"
        />
      </FormControl>
    </div>
  );
}
