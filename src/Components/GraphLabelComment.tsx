import React, { useEffect } from 'react';
import useStore from '../store';
import { TextField } from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';

const useStyles = DashboardStyle;

export default function GraphLabelComment(propsIn) {
  const classes = useStyles();

  const { props } = propsIn;
  const { element } = props;
  // const { setElement } = propsIn;

  const graphRF = useStore((state) => state.graphRF);
  const [label, setLabel] = React.useState('');
  const [comment, setComment] = React.useState('');
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  useEffect(() => {
    console.log(element);
    setLabel(element.label);
    setComment(element.uiProps && element.uiProps.comment);
  }, [element.id, element]);

  const labelChanged = (event) => {
    setLabel(event.target.value);
    if ('position' in element) {
      const el = element;
      setSelectedElement(
        {
          ...el,
          label: event.target.value,
          data: { ...element.data, label: event.target.value },
        },
        'fromSaveElement'
      );
    } else {
      setSelectedElement(
        {
          ...element,
          label: event.target.value,
        },
        'fromSaveElement'
      );
    }
  };

  const graphCommentChanged = (event) => {
    setComment(event.target.value);
    setSelectedElement(
      {
        ...element,
        uiProps: { ...element.uiProps, comment: event.target.value },
      },
      'fromSaveElement'
    );
  };

  return (
    <>
      <div>
        <b>Id:</b> {graphRF.graph.id}
      </div>
      {/* <div>
        <b>Label:</b> {graphRF.graph.label}
      </div> */}
      <div className={classes.detailsLabels}>
        <TextField
          id="outlined-basic"
          label="Label"
          variant="outlined"
          value={label || ''}
          onChange={labelChanged}
        />
      </div>
      <div className={classes.detailsLabels}>
        <TextField
          id="outlined-basic"
          label="Comment"
          variant="outlined"
          value={comment || ''}
          onChange={graphCommentChanged}
        />
      </div>
      {/* <div>
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
