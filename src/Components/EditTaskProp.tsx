import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/EditOutlined';
import { createStyles, IconButton, TextField, Theme } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';

const useStyles = DashboardStyle;

function EditTaskProp({ id, label, value, propChanged, editProps }) {
  const classes = useStyles();

  const [editProp, setEditProp] = React.useState(false);
  const [taskProp, setTaskProp] = React.useState('');

  // //console.log(id, label, value, propChanged, editProps);

  useEffect(() => {
    setTaskProp(value);
    if (!editProps) {
      setEditProp(false);
    }
  }, [value, editProps]);

  const onEditProp = () => {
    // //console.log(selectedElement);
    setEditProp(!editProp);
  };

  const taskPropChanged = (event) => {
    setTaskProp(event.target.value);
    propChanged({ [id]: event.target.value });
  };

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
        />
      )}
    </>
  );
}
export default EditTaskProp;
