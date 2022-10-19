import React, { useEffect } from 'react';
import EditIcon from '@material-ui/icons/EditOutlined';
import { IconButton, TextField } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';

const useStyles = DashboardStyle;

interface EditTaskProps {
  id: string;
  label: string;
  value: string;
  editProps: boolean;
  propChanged(props: editableNodeProps): void;
}
interface editableNodeProps {
  task_identifier?: string;
  task_type?: string;
  task_generator?: string;
}
// DOC: For editing Node properties related to the Task it is based on
function EditTaskProp(props: EditTaskProps) {
  const { id, label, value, editProps } = props;
  const classes = useStyles();

  const [editProp, setEditProp] = React.useState(false);
  const [taskProp, setTaskProp] = React.useState('');

  useEffect(() => {
    setTaskProp(value);
    if (!editProps) {
      setEditProp(false);
    }
  }, [value, editProps]);

  function onEditProp() {
    setEditProp(!editProp);
  }

  function taskPropChanged(event) {
    setTaskProp(event.target.value);
    props.propChanged({ [id]: event.target.value });
  }

  function enterPressed(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      setEditProp(!editProp);
    }
  }

  return (
    <>
      <div className={classes.detailsLabels}>
        {editProps && (
          <IconButton
            style={{ padding: '1px' }}
            aria-label="edit"
            onClick={onEditProp}
          >
            <EditIcon />
          </IconButton>
        )}
        {!editProp && (
          <>
            <b>{label}: </b>
            <span>{value}</span>
          </>
        )}
      </div>
      {editProp && (
        <TextField
          id={id}
          label={label}
          variant="outlined"
          value={taskProp || ''}
          onChange={taskPropChanged}
          onKeyPress={enterPressed}
        />
      )}
    </>
  );
}
export default EditTaskProp;
