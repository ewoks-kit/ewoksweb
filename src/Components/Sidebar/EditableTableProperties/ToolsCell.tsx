import { Button, Fab, IconButton, TableCell } from '@material-ui/core';
import { useStyles } from './EditableTable';
import {
  EditOutlined as EditIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
} from '@material-ui/icons';

interface Props {
  onSave: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  isEditing?: boolean;
}

function ToolsCell(props: Props) {
  const { isEditing, onSave, onEdit, onDelete } = props;
  const classes = useStyles();

  return (
    <TableCell className={classes.selectTableCell}>
      {isEditing ? (
        //   <Button
        //   variant="contained"
        //   color="primary"
        //   size="large"
        //   // className={classes.button}
        //   startIcon={<SaveIcon />}
        // >
        //   Save
        // </Button>
        <IconButton
          color="primary"
          onClick={() => onSave()}
          className={classes.root}
          aria-label="edit"
          data-cy="doneEditingButtonEditableTable"
        >
          {/* <Fab
            // className={classes.openFileButton}
            color="primary"
            size="small"
            component="span"
            aria-label="add"
          > */}
          <SaveIcon fontSize="medium" />
          {/* </Fab> */}
        </IconButton>
      ) : (
        <IconButton
          size="small"
          className={classes.root}
          aria-label="edit"
          onClick={() => onEdit()}
          color="primary"
          data-cy="editButtonEditableTable"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      )}
      <IconButton
        size="medium"
        color="secondary"
        className={classes.root}
        onClick={() => onDelete()}
        aria-label="delete"
        data-cy="deleteButtonEditableTable"
      >
        <DeleteIcon fontSize="medium" />
      </IconButton>
    </TableCell>
  );
}

export default ToolsCell;
