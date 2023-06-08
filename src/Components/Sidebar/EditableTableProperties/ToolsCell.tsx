import { Button, TableCell } from '@material-ui/core';
import { RemoveCircleOutline } from '@material-ui/icons';
import { useStyles } from './EditableTable';

interface Props {
  onDelete: () => void;
}

function ToolsCell(props: Props) {
  const { onDelete } = props;
  const classes = useStyles();

  return (
    <TableCell
      className={classes.selectTableCell}
      style={{ borderBottom: 'none', display: 'flex', minWidth: '25px' }}
    >
      <Button
        style={{
          minWidth: '15px',
        }}
        aria-label="Remove row"
        onClick={() => onDelete()}
        endIcon={
          <RemoveCircleOutline
            htmlColor="#rgb(108, 128, 236)"
            style={{ marginLeft: '-9px', marginRight: '2px' }}
          />
        }
        data-cy="deleteButtonEditableTable"
      />
    </TableCell>
  );
}

export default ToolsCell;
