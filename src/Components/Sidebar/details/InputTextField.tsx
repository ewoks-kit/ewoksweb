import { FormControl, TextField } from '@material-ui/core';

import styles from './Details.module.css';

interface InputTextFieldProps {
  label: string;
  defaultValue: string | undefined;
  onValueSave(value: string): void;
}

export default function InputTextField(props: InputTextFieldProps) {
  const { label, defaultValue } = props;

  return (
    <div className={styles.entry}>
      <FormControl fullWidth size="small">
        <TextField
          label={label}
          variant="outlined"
          defaultValue={defaultValue || ''}
          margin="dense"
          onChange={(event) => props.onValueSave(event.target.value)}
          multiline
          inputProps={{ 'aria-label': `Edit ${label.toLowerCase()}` }}
        />
      </FormControl>
    </div>
  );
}
