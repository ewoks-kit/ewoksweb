import React, { useEffect, useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';

import DashboardStyle from '../layout/DashboardStyle';
import type { EwoksRFNode } from '../types';
import state from '../store/state';

const useStyles = DashboardStyle;

interface EditNodeStyleProps {
  element: EwoksRFNode;
}
// DOC: Edit the node style
export default function EditNodeStyle(props: EditNodeStyleProps) {
  const classes = useStyles();
  // console.log(props);
  const { element } = props;

  const setSelectedElement = state((state) => state.setSelectedElement);

  // const [nodeType, setNodeType] = React.useState('');
  const [withImage, setWithImage] = useState<boolean>(false);
  const [withLabel, setWithLabel] = useState<boolean>(false);
  const [colorBorder, setColorBorder] = useState<string>('');
  const [moreHandles, setMoreHandles] = useState<boolean>(true);
  const [nodeSize, setNodeSize] = useState<number>(100);
  const selectedElement = state((state) => state.selectedElement);

  useEffect(() => {
    if ('position' in element) {
      setWithImage(element.data.withImage);
      setWithLabel(element.data.withLabel);
      setColorBorder(element.data.colorBorder || '');
      setMoreHandles(!!element.data.moreHandles);
      setNodeSize(element.data.nodeWidth || 100);
    }
  }, [element.id, element]);

  // const nodeTypeChanged = (event) => {
  //   setNodeType(event.target.value);
  //   setSelectedElement(
  //     {
  //       ...element,
  //       data: { ...element.data, type: event.target.value },
  //     },
  //     'fromSaveElement'
  //   );
  // };

  const withImageChanged = (event) => {
    // console.log(element, event.target.checked);
    setWithImage(event.target.checked);
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, withImage: event.target.checked },
      },
      'fromSaveElement'
    );
  };

  const withLabelChanged = (event) => {
    // console.log(element, event.target.checked);
    setWithLabel(event.target.checked);
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, withLabel: event.target.checked },
      },
      'fromSaveElement'
    );
  };

  const colorBorderChanged = (event) => {
    // console.log(element, event.target.value);
    setColorBorder(event.target.value);
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, colorBorder: event.target.value },
      },
      'fromSaveElement'
    );
  };

  const moreHandlesChanged = (event) => {
    setMoreHandles(event.target.checked);
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          moreHandles: event.target.checked,
        },
      },
      'fromSaveElement'
    );
  };

  const changeNodeSize = (event, number) => {
    // TODO: find a better way than declaring a const for type
    const el: EwoksRFNode =
      'task_identifier' in selectedElement && selectedElement;
    setSelectedElement(
      {
        ...el,
        data: { ...el.data, nodeWidth: number },
      },
      'fromSaveElement'
    );
    setNodeSize(number);
  };

  return (
    <FormControl variant="filled" fullWidth className={classes.sidebarForm}>
      {/* <InputLabel>Node type</InputLabel>
      <Select
        id="demo-simple-select"
        value={nodeType ? nodeType : 'internal'}
        label="Node type"
        onChange={nodeTypeChanged}
      >
        {['input', 'output', 'internal', 'input_output'].map((tex) => (
          <MenuItem key={tex} value={tex}>
            {tex}
          </MenuItem>
        ))}
      </Select> */}
      {element.task_type !== 'note' && (
        <>
          <div>
            <label htmlFor="withImage">With Image</label>
            <Checkbox
              name="withImage"
              checked={withImage === undefined ? true : !!withImage}
              onChange={withImageChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="withLabel">With Label</label>
            <Checkbox
              name="withLabel"
              checked={withLabel === undefined ? true : !!withLabel}
              onChange={withLabelChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>

          <div>
            <label htmlFor="head">Color</label>
            <input
              aria-label="Color"
              type="color"
              id="head"
              name="head"
              value={colorBorder}
              onChange={colorBorderChanged}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(element.task_type) && (
        <div>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={moreHandles}
              onChange={moreHandlesChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      )}
      <div>
        <label htmlFor="nodeSize">Node Size</label>
        <Slider
          id="nodeSize"
          color="primary"
          defaultValue={nodeSize}
          value={nodeSize}
          onChange={changeNodeSize}
          min={40}
          max={300}
          style={{ width: '90%' }}
          // aria-label="Small"
          // valueLabelDisplay="auto"
        />
      </div>
    </FormControl>
  );
}
