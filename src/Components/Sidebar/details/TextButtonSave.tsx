import { FormControl, TextField } from '@material-ui/core';
import { useDashboardStyles } from '../../Dashboard/useDashboardStyles';
import sidebarStyle from '../sidebarStyle';

interface TextButtonSaveProps {
  label: string;
  value: string | undefined;
  onValueSave(value: string): void;
}

export default function TextButtonSave(props: TextButtonSaveProps) {
  const classes = useDashboardStyles();

  const { label, value } = props;

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
          value={value || ''}
          margin="dense"
          style={{
            width: '98%',
            margin: '0 0 7px 0',
          }}
          onChange={(event) => props.onValueSave(event.target.value)}
          multiline
          data-cy="node-edge-label"
        />
      </FormControl>
    </div>
  );
}
