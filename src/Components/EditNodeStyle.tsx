import React, { useEffect } from 'react';
import { Checkbox, FormControl } from '@material-ui/core';
import useStore from '../store';
import DashboardStyle from '../layout/DashboardStyle';
import type { EwoksRFNode } from '../types';

const useStyles = DashboardStyle;

export default function EditNodeStyle(propsIn) {
  const classes = useStyles();

  const { props } = propsIn;
  const { element } = props;

  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [nodeType, setNodeType] = React.useState('');
  const [withImage, setWithImage] = React.useState<boolean>(false);
  const [withLabel, setWithLabel] = React.useState<boolean>(false);
  const [colorBorder, setColorBorder] = React.useState<string>('');
  const [moreHandles, setMoreHandles] = React.useState<boolean>(true);

  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  useEffect(() => {
    console.log(element);
    if ('position' in element) {
      setWithImage(element.data.withImage);
      setWithLabel(element.data.withLabel);
      setColorBorder(element.data.colorBorder);
      setMoreHandles(!!element.data.moreHandles);
    }
  }, [element.id, element]);

  const nodeTypeChanged = (event) => {
    setNodeType(event.target.value);
    setSelectedElement(
      {
        ...element,
        data: { ...element.data, type: event.target.value },
      },
      'fromSaveElement'
    );
  };

  const withImageChanged = (event) => {
    console.log(element, event.target.checked);
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
    console.log(element, event.target.checked);
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
    console.log(element, event.target.value);
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
        ...(element as EwoksRFNode),
        data: { ...element.data, moreHandles: event.target.checked },
      },
      'fromSaveElement1'
    );
    // TODO: Remove when refresh is resolved
    setOpenSnackbar({
      open: true,
      text: `Please save and reload the graph before using the new handles`,
      severity: 'warning',
    });
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
      {!['graphInput', 'graphOutput', 'graph'].includes(element.task_type) && (
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
        <label htmlFor="withImage">With Image</label>
        <Checkbox
          name="withImage"
          checked={
            withImage === undefined ? true : withImage === false ? false : true
          }
          onChange={withImageChanged}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>
      <div>
        <label htmlFor="withLabel">With Label</label>
        <Checkbox
          name="withLabel"
          checked={
            withLabel === undefined ? true : withLabel === false ? false : true
          }
          onChange={withLabelChanged}
          inputProps={{ 'aria-label': 'controlled' }}
        />
      </div>
      <div>
        <label htmlFor="head">Color</label>
        <input
          type="color"
          id="head"
          name="head"
          value={colorBorder}
          onChange={colorBorderChanged}
          style={{ margin: '10px' }}
        />
      </div>
    </FormControl>
  );
}
