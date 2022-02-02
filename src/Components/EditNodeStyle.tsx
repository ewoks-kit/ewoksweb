import React, { useEffect } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import useStore from '../store';
import type { EwoksRFLink, EwoksRFNode } from '../types';

export default function EditNodeStyle(propsIn) {
  console.log(propsIn);
  const { props } = propsIn;
  const { element } = props;

  const selectedElement = useStore<EwoksRFNode | EwoksRFLink>(
    (state) => state.selectedElement
  );
  const setSelectedElement = useStore((state) => state.setSelectedElement);

  const [nodeType, setNodeType] = React.useState('');
  const [withImage, setWithImage] = React.useState<boolean>(false);
  const [withLabel, setWithLabel] = React.useState<boolean>(false);
  const [colorBorder, setColorBorder] = React.useState<string>('');

  useEffect(() => {
    console.log(element);
    if ('position' in element) {
      setWithImage(element.data.withImage);
      setWithLabel(element.data.withLabel);
      setColorBorder(element.data.colorBorder);
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

  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel>Node type</InputLabel>
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
      </Select>
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
