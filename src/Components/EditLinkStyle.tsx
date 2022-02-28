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

export default function EditLinkStyle(propsIn) {
  const classes = useStyles();

  const { props } = propsIn;
  const { element } = props;

  const setSelectedElement = state((state) => state.setSelectedElement);

  const [linkType, setLinkType] = React.useState('');
  const [arrowType, setArrowType] = React.useState('');
  const [animated, setAnimated] = React.useState<boolean>(false);
  const [colorLine, setColorLine] = React.useState<string>('');

  useEffect(() => {
    console.log(element);
    if ('source' in element) {
      setLinkType(element.type);
      setArrowType(element.arrowHeadType);
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
    setSelectedElement(
      {
        ...element,
        arrowHeadType: event.target.value,
      },
      'fromSaveElement'
    );
  };

  const colorLineChanged = (event) => {
    // console.log(element, event.target.value, {
    //   ...element,
    //   style: { ...element.style, stroke: event.target.value },
    // });
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
          {['straight', 'smoothstep', 'step', 'default', 'bendingText'].map(
            (text) => (
              <MenuItem key={text} value={text}>
                {text}
              </MenuItem>
            )
          )}
        </Select>
      </FormControl>
      <FormControl variant="filled" fullWidth>
        <InputLabel id="ArrowHeadType">Arrow Head Type</InputLabel>
        <Select
          value={arrowType ? arrowType : 'arrowclosed'}
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
