import { FormControl, TextField } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';

interface TextButtonSaveProps {
  label: string;
  defaultValue: string | undefined;
  onValueSave(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useDashboardStyles();

  const { label, defaultValue } = props;

  return (
    <div className={classes.detailsLabels}>
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
