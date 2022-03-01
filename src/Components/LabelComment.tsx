import React, { useEffect } from 'react';

import type { EwoksRFLink, EwoksRFNode, Inputs } from '../types';
import {
  Box,
  Button,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@material-ui/core';
import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';

const useStyles = DashboardStyle;

// DOC: the label and comment for nodes-links when selected
export default function LabelComment(propsIn) {
  const classes = useStyles();

  const { props } = propsIn;
  const { element } = props;

  const [comment, setComment] = React.useState('');
  const [label, setLabel] = React.useState('');
  const setSelectedElement = state((state) => state.setSelectedElement);

  useEffect(() => {
    if ('position' in element) {
      console.log(element);
      setLabel(element.data.label);
      setComment(element.data.comment);
    } else if ('source' in element) {
      setLabel(element.label);
      setComment(element.data && element.data.comment);
    }
  }, [element]);

  const useConditions = () => {
    // console.log(element);
    const el = element as EwoksRFLink;
    const newLabel =
      el.data.conditions.length > 0
        ? el.data.conditions
            .map((con) => con.source_output + ': ' + JSON.stringify(con.value))
            .join(', ')
        : '';
    setLabel(newLabel);
    setSelectedElement(
      {
        ...element,
        label: newLabel,
      },
      'fromSaveElement'
    );
  };

  const useMapping = () => {
    // console.log(element);
    const el = element as EwoksRFLink;
    const newLabel =
      el.data.data_mapping.length > 0
        ? el.data.data_mapping
            .map((con) => `${con.source_output}->${con.target_input}`)
            .join(', ')
        : '';
    setLabel(newLabel);
    setSelectedElement(
      {
        ...element,
        label: newLabel,
      },
      'fromSaveElement'
    );
  };

  const labelChanged = (event) => {
    // console.log('label changed:', event.target.value);
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

  const commentChanged = (event) => {
    // console.log('comment changed:', event.target.value);
    setComment(event.target.value);
    const el = element;
    setSelectedElement(
      {
        ...el,
        data: { ...element.data, comment: event.target.value },
      },
      'fromSaveElement'
    );
  };

  return (
    <>
      <div className={classes.detailsLabels}>
        <Box>
          {Object.keys(element).includes('source') && (
            <Tooltip title="Use conditions or data-mapping as label" arrow>
              <span>
                <Button
                  style={{ margin: '8px' }}
                  variant="contained"
                  color="primary"
                  onClick={useConditions}
                  size="small"
                >
                  conditions
                </Button>
                <Button
                  style={{ margin: '8px' }}
                  variant="contained"
                  color="primary"
                  onClick={useMapping}
                  size="small"
                >
                  mapping
                </Button>
              </span>
            </Tooltip>
          )}
          <TextField
            id="outlined-basic"
            label="Label"
            variant="outlined"
            value={label || ''}
            onChange={labelChanged}
            multiline
          />
        </Box>
      </div>
      <div>
        <Box>
          <TextField
            id="outlined-basic"
            label="Comment"
            variant="outlined"
            value={comment || ''}
            onChange={commentChanged}
            multiline
          />
        </Box>
      </div>
    </>
  );
}
