import { useEffect, useState } from 'react';

import { FormControl, IconButton, TextField, Fab } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import SaveIcon from '@material-ui/icons/Save';
import useStore from '../../../store/useStore';
import sidebarStyle from '../sidebarStyle';
import type { ChangeEvent } from 'react';

interface TextButtonSaveProps {
  label: string;
  value: string;
  valueSaved(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useDashboardStyles();
  // console.log(props); this is rerendered more than it should examine

  const { label, value } = props;

  const [valueLocal, setValueLocal] = useState(value);
  const [valueIsChanged, setValueIsChanged] = useState(false);
  const inExecutionMode = useStore((state) => state.inExecutionMode);

  useEffect(() => {
    setValueLocal(value);
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
        variant="outlined"
      >
        <TextField
          label={label}
          // variant="outlined"
          value={valueLocal || ''}
          style={{ width: valueIsChanged ? '80%' : '93%' }}
          onChange={valueChanged}
          multiline
          data-cy="node-edge-label"
        />

        {valueIsChanged && (
          <IconButton
            style={{ width: '20%', minWidth: '40px' }}
            color="inherit"
            onClick={valueSavedLocal}
          >
            <Fab
              className={classes.openFileButton}
              color="primary"
              size="small"
              component="span"
              aria-label="saveLabelComment"
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
