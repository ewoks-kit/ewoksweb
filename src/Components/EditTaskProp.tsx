import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@material-ui/icons/EditOutlined';
import { createStyles, IconButton, TextField, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& > *': {
        margin: theme.spacing(1, 0),
        wordBreak: 'break-word',
        // width: '25ch',
      },
    },
  })
);

function EditTaskProp({ id, label, value, propChanged, editProps }) {
  const classes = useStyles();

  const [editProp, setEditProp] = React.useState(false);
  const [taskProp, setTaskProp] = React.useState('');

  useEffect(() => {
    setTaskProp(value);
  }, [value]);

  const onEditProp = () => {
    // console.log(selectedElement);
    setEditProp(!editProp);
  };

  const taskPropChanged = (event) => {
    setTaskProp(event.target.value);
    propChanged({ [id]: event.target.value });
  };

  return (
    <>
      <div className={classes.root}>
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
