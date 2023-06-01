import { useState } from 'react';

import { FormControl, TextField } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import sidebarStyle from '../sidebarStyle';
import { useDebouncedEffect } from '@react-hookz/web';

interface TextButtonSaveProps {
  label: string;
  value: string;
  valueSaved(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useDashboardStyles();

  const { label, value } = props;

  const [valueLocal, setValueLocal] = useState(value);

  useDebouncedEffect(
    () => {
      props.valueSaved(valueLocal);
    },
    [valueLocal],
    100,
    500
  );

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
            margin: '0 0 7px 0',
          }}
          onChange={(event) => setValueLocal(event.target.value)}
          multiline
          data-cy="node-edge-label"
        />
      </FormControl>
    </div>
  );
}
