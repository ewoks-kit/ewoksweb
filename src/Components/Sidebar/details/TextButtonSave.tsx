import { useEffect, useState } from 'react';

import { FormControl, TextField } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import sidebarStyle from '../sidebarStyle';
import { useDebouncedEffect } from '@react-hookz/web';

interface TextButtonSaveProps {
  label: string;
  value: string | undefined;
  valueSaved(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useDashboardStyles();

  const { label, value } = props;

  const [valueLocal, setValueLocal] = useState(value);

  // TBD: the use effect can be removed but an initial undefined appears
  // console.log(label, value, valueLocal);
  useEffect(() => {
    setValueLocal(value);
  }, [value]);

  useDebouncedEffect(
    () => {
      if (valueLocal || valueLocal === '') {
        props.valueSaved(valueLocal);
      }
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
            width: '98%',
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
