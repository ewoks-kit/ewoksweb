import React, { useEffect, useState } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@material-ui/core';

import DashboardStyle from '../layout/DashboardStyle';
import state from '../store/state';
import type { EwoksRFLink } from '../types';

const useStyles = DashboardStyle;

interface EditLinkStyleProps {
  element: EwoksRFLink;
}
// DOC: Edit the link style
export default function EditLinkStyle(props: EditLinkStyleProps) {
  const classes = useStyles();

  const { element } = props;

  const setSelectedElement = state((state) => state.setSelectedElement);
  const selectedElement = state((state) => state.selectedElement);

  const [linkType, setLinkType] = useState('');
  const [arrowType, setArrowType] = useState({ type: 'arrow' });
  const [animated, setAnimated] = useState<boolean>(false);
  const [colorLine, setColorLine] = useState<string>('');
  const [x, setX] = useState(80);
  const [y, setY] = useState(80);

  useEffect(() => {
    // console.log(element);
    if ('source' in element) {
      setLinkType(element.type);
      setArrowType(element.markerEnd);
      // setArrowType(element.markerStart);
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

  const changeX = (event, number) => {
    const elem = selectedElement as EwoksRFLink;
    setSelectedElement(
      {
        ...elem,
        data: {
          ...elem.data,
          getAroundProps: { ...elem.data.getAroundProps, x: number },
        },
      },
      'fromSaveElement'
    );
    setX(number);
  };

  const changeY = (event, number) => {
    const elem = selectedElement as EwoksRFLink;
    setSelectedElement(
      {
        ...elem,
        data: {
          ...elem.data,
          getAroundProps: { ...elem.data.getAroundProps, y: number },
        },
      },
      'fromSaveElement'
    );
    setY(number);
  };

  // FOr brakpints in links MUST be nodes that will be minimal and:
  // saved in link uiProps as a node with only position being important and type=breakpointNode
  // the RF graph will have 2 links that will be clickable... if one changes
  // label, comment or style what the other will do?
  // AN SVG solution maybe better? A custom SVG link but no draggable breakpoints...
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
            'multilineText',
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
      {linkType === 'getAround' && (
        <div>
          Size of Link
          <div>X</div>
          <Slider
            id="slideX"
            color="primary"
            defaultValue={x}
            value={x}
            onChange={changeX}
            min={-200}
            max={200}
            style={{ width: '90%' }}
            // aria-label="Small"
            // valueLabelDisplay="auto"
          />
          <div>Y</div>
          <Slider
            id="slideY"
            color="primary"
            defaultValue={y}
            value={y}
            onChange={changeY}
            min={-200}
            max={200}
            style={{ width: '90%' }}
            // aria-label="Small"
            // valueLabelDisplay="auto"
          />
        </div>
      )}
    </>
  );
}
