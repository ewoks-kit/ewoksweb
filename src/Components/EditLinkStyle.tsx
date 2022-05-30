import React, { useEffect } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';

import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';

const useStyles = DashboardStyle;

export default function EditLinkStyle(props) {
  const classes = useStyles();

  const { element } = props;

  const setSelectedElement = state((state) => state.setSelectedElement);

  const [linkType, setLinkType] = React.useState('');
  const [arrowType, setArrowType] = React.useState({ type: 'arrow' });
  const [animated, setAnimated] = React.useState<boolean>(false);
  const [colorLine, setColorLine] = React.useState<string>('');

  useEffect(() => {
    // console.log(element);
    if ('source' in element) {
      setLinkType(element.type);
      setArrowType(element.markerEnd);
      setAnimated(element.animated);
      setColorLine(element.style.stroke);
    }
  }, [element.id, element]);

  const linkTypeChanged = (event) => {
    setLinkType(event.target.value);
    setSelectedElement(
      {
        ...element,
        type: event.target.value,
      },
      'fromSaveElement'
    );
  };

  const arrowTypeChanged = (event) => {
    setArrowType(event.target.value);
    // 'none' is not available anymore in reactFlow so we
    // need to remove markerEnd if 'none' is selected in dropdown
    if (event.target.value === 'none') {
      if ('markerEnd' in element) {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { markerEnd, ...restElement } = element;
        setSelectedElement({ ...restElement }, 'fromSaveElement');
      }
    } else {
      setSelectedElement(
        { ...element, markerEnd: { type: event.target.value } },
        'fromSaveElement'
      );
    }
  };

  const colorLineChanged = (event) => {
    setColorLine(event.target.value);
    setSelectedElement(
      {
        ...element,
        style: { ...element.style, stroke: event.target.value },
        labelStyle: { ...element.labelStyle, fill: event.target.value },
        labelBgStyle: { ...element.labelBgStyle, stroke: event.target.value },
      },
      'fromSaveElement'
    );
  };

  const animatedChanged = (event) => {
    setAnimated(event.target.checked);
    setSelectedElement(
      {
        ...element,
        animated: event.target.checked,
      },
      'fromSaveElement'
    );
  };

  return (
    <>
      <FormControl variant="filled" fullWidth className={classes.sidebarForm}>
        <InputLabel id="linkTypeLabel">Link type</InputLabel>
        <Select
          labelId="linkTypeLabel"
          value={linkType ? linkType : 'default'}
          label="Link type"
          onChange={linkTypeChanged}
        >
          {[
            'straight',
            'smoothstep',
            'step',
            'default',
            'bendingText',
            'getAround',
          ].map((text) => (
            <MenuItem key={text} value={text}>
              {text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="filled" fullWidth>
        <InputLabel id="markerEnd">Arrow Head Type</InputLabel>
        <Select
          value={arrowType?.type || 'none'}
          label="Arrow head"
          onChange={arrowTypeChanged}
        >
          {['arrow', 'arrowclosed', 'none'].map((tex) => (
            <MenuItem value={tex} key={tex}>
              {tex}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div>
        <label htmlFor="animated">Animated</label>
        <Checkbox
          name="animated"
          checked={animated ? animated : false}
          onChange={animatedChanged}
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
          value={colorLine}
          onChange={colorLineChanged}
          style={{ margin: '10px' }}
        />
      </div>
    </>
  );
}
