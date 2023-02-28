import { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@material-ui/core';

import DashboardStyle from '../../Dashboard/DashboardStyle';
import useStore from '../../../store/useStore';
import type { EwoksRFLink, PropertyChangedEvent } from '../../../types';
import sidebarStyle from '../sidebarStyle';
import type { ChangeEvent } from 'react';
import { isMarkerType, isString } from '../../../utils/typeGuards';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useReactFlow } from 'reactflow';

const useStyles = DashboardStyle;

// DOC: Edit the link style
export default function EditLinkStyle(element: EwoksRFLink) {
  const classes = useStyles();

  const { setEdges, getEdges } = useReactFlow();

  const setSelectedElement = useStore((state) => state.setSelectedElement);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  const [linkType, setLinkType] = useState('default');
  const [arrowType, setArrowType] = useState<MarkerType | 'none'>(
    MarkerType.Arrow
  );
  const [animated, setAnimated] = useState<boolean>(false);
  const [colorLine, setColorLine] = useState<string>('');
  const [x, setX] = useState(80);
  const [y, setY] = useState(80);

  useEffect(() => {
    if (element.type) {
      setLinkType(element.type);
    }

    if (element.type === 'getAround') {
      setX(element.data.getAroundProps?.x || 80);
      setY(element.data.getAroundProps?.y || 80);
    }

    const { markerEnd } = element;
    if (!markerEnd) {
      setArrowType('none');
    } else if (isString(markerEnd)) {
      setArrowType(isMarkerType(markerEnd) ? markerEnd : 'none');
    } else {
      setArrowType(markerEnd.type);
    }

    setAnimated(!!element.animated);
    setColorLine(element.style?.stroke || '#96a5f9');
  }, [element]);

  function linkTypeChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    if (['multilineText', 'getAround'].includes(val)) {
      setOpenSnackbar({
        open: true,
        text: 'Insert commas (,) in the label to break into multiple lines!',
        severity: 'success',
      });
    }
    setSelectedElement(
      {
        ...element,
        type: val,
      },
      'fromSaveElement'
    );
  }

  const arrowTypeChanged = (event: PropertyChangedEvent) => {
    // 'none' is not available anymore in reactFlow so we
    // need to remove markerEnd if 'none' is selected in dropdown
    const type = event.target.value;
    if (!isString(type)) {
      return;
    }

    if (isMarkerType(type)) {
      setSelectedElement(
        { ...element, markerEnd: { type } },
        'fromSaveElement'
      );
      return;
    }

    setSelectedElement({ ...element, markerEnd: undefined }, 'fromSaveElement');
  };

  const colorLineChanged = (event: ChangeEvent<HTMLInputElement>) => {
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

  const animatedChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedElement(
      {
        ...element,
        animated: event.target.checked,
      },
      'fromSaveElement'
    );
  };

  function changeX(_event: ChangeEvent<unknown>, value: number | number[]) {
    const newX = value as number;
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          getAroundProps: {
            ...element.data.getAroundProps,
            x: newX,
          },
        },
      },
      'fromSaveElement'
    );
    setX(newX);
  }

  function changeY(_event: ChangeEvent<unknown>, value: number | number[]) {
    const newY = value as number;
    setSelectedElement(
      {
        ...element,
        data: {
          ...element.data,
          getAroundProps: {
            ...element.data.getAroundProps,
            y: newY,
          },
        },
      },
      'fromSaveElement'
    );
    setY(newY);
  }

  function applyLinkTypeToAll() {
    const newEdges: Edge[] = getEdges().map((edge) => ({
      ...edge,
      type: linkType,
    }));
    setEdges(newEdges);
  }

  function applyArrowTypeToAll() {
    const newEdges: Edge[] = getEdges().map((edge) => {
      if (arrowType === 'none') {
        return { ...edge, markerEnd: undefined };
      }
      return { ...edge, markerEnd: { type: arrowType } };
    });
    setEdges(newEdges);
  }

  return (
    <>
      <FormControl
        variant="filled"
        fullWidth
        style={{ ...sidebarStyle.formstyleflex }}
      >
        <InputLabel id="linkTypeLabel">Link type</InputLabel>
        <Select
          className={classes.styleLinkDropdowns}
          labelId="linkTypeLabel"
          value={linkType}
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
        <Button
          style={{ margin: '8px' }}
          variant="outlined"
          color="primary"
          onClick={applyLinkTypeToAll}
          size="small"
        >
          Apply to all
        </Button>
      </FormControl>
      <FormControl
        variant="filled"
        fullWidth
        style={{ ...sidebarStyle.formstyleflex }}
      >
        <InputLabel id="markerEnd">Arrow Head</InputLabel>
        <Select
          className={classes.styleLinkDropdowns}
          value={arrowType}
          label="Arrow head"
          onChange={arrowTypeChanged}
        >
          {[...Object.values(MarkerType), 'none'].map((tex) => (
            <MenuItem value={tex} key={tex}>
              {tex}
            </MenuItem>
          ))}
        </Select>
        <Button
          style={{ margin: '8px' }}
          variant="outlined"
          color="primary"
          onClick={applyArrowTypeToAll}
          size="small"
        >
          Apply to all
        </Button>
      </FormControl>
      <div>
        <label htmlFor="animated">Animated</label>
        <Checkbox
          name="animated"
          checked={animated}
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
          />
        </div>
      )}
    </>
  );
}
