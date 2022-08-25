import React, { useEffect } from 'react';

import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import type { GraphDetails } from '../types';

const useStyles = DashboardStyle;

// DOC: the label and the comment when the graph is the selectedElement
export default function GraphLabelComment() {
  const classes = useStyles();

  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [category, setCategory] = React.useState('');
  const setSelectedElement = state((state) => state.setSelectedElement);
  const selectedElement = state((state) => state.selectedElement);

  useEffect(() => {
    const graphElement = selectedElement as GraphDetails;
    setLabel(graphElement.label);
    setCategory(graphElement.category);
    setComment(graphElement.uiProps && graphElement.uiProps.comment);
  }, [selectedElement.id, selectedElement]);

  const categoryChanged = (event) => {
    setCategory(event.target.value);
    setSelectedElement(
      {
        ...selectedElement,
        category: event.target.value,
      } as GraphDetails,
      'fromSaveElement'
    );
  };

  const labelChanged = (event) => {
    setLabel(event.target.value);
    setSelectedElement(
      {
        ...selectedElement,
        label: event.target.value,
      },
      'fromSaveElement'
    );
  };

  const graphCommentChanged = (event) => {
    setComment(event.target.value);
    setSelectedElement(
      {
        ...selectedElement,
        uiProps: { ...selectedElement.uiProps, comment: event.target.value },
      },
      'fromSaveElement'
    );
  };

  return (
    <>
      {/* <div>
        <b>Id:</b> {graphRF.graph.id}
      </div> */}
      {/* <div>
        <b>Label:</b> {graphRF.graph.label}
      </div> */}
      <FormControl
        fullWidth
        variant="outlined"
        className={classes.detailsLabels}
      >
        <InputLabel htmlFor="outlined-label">Label</InputLabel>
        <OutlinedInput
          id="outlined-label"
          value={label || ''}
          onChange={labelChanged}
          labelWidth={60}
        />
      </FormControl>
      <FormControl
        fullWidth
        variant="outlined"
        className={classes.detailsLabels}
      >
        <InputLabel htmlFor="outlined-comment">Comment</InputLabel>
        <OutlinedInput
          id="outlined-comment"
          value={comment || ''}
          onChange={graphCommentChanged}
          labelWidth={60}
        />
      </FormControl>
      <FormControl
        fullWidth
        variant="outlined"
        className={classes.detailsLabels}
      >
        <InputLabel htmlFor="outlined-category">Category</InputLabel>
        <OutlinedInput
          id="outlined-category"
          value={category || ''}
          onChange={categoryChanged}
          labelWidth={60}
        />
      </FormControl>
      {/* <div className={classes.detailsLabels}>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          value={label || ''}
          onChange={labelChanged}
        />
      </div> */}
      {/* <div className={classes.detailsLabels}>
        <TextField
          id="outlined-basic"
          label="Comment"
          variant="outlined"
          value={comment || ''}
          onChange={graphCommentChanged}
          multiline
        />
      </div>
      <div className={classes.detailsLabels}>
        <TextField
          id="outlined-basic"
          label="Category"
          variant="outlined"
          value={category || ''}
          onChange={categoryChanged}
        />
      </div> */}
      {/* DOC: if the inputs and outputs of the graph are needed
      <div>
      <b>Inputs </b>
      {graphInputs.length > 0 && <DenseTable data={graphInputs} />}
    </div>
    <div>
      <b>Outputs </b>
      {graphOutputs.length > 0 && <DenseTable data={graphOutputs} />}
    </div> */}
    </>
  );
}
