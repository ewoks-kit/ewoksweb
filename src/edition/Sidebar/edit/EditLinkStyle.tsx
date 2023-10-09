import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useReactFlow } from 'reactflow';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import type { PropertyChangedEvent } from '../../../types';
import {
  assertEdgeDataDefined,
  isMarkerType,
  isString,
} from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';

// DOC: Edit the link style
export default function EditLinkStyle(element: Edge) {
  const { setEdges, getEdges } = useReactFlow();
  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);

  const [linkType, setLinkType] = useState('default');
  const [arrowType, setArrowType] = useState<MarkerType | 'none'>(
    MarkerType.Arrow,
  );
  const [animated, setAnimated] = useState(false);
  const [colorLine, setColorLine] = useState('');
  const [x, setX] = useState(80);
  const [y, setY] = useState(80);

  useEffect(() => {
    if (element.type) {
      setLinkType(element.type);
    }

    if (element.type === 'getAround') {
      setX(edgeData.getAroundProps?.x || 80);
      setY(edgeData.getAroundProps?.y || 80);
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
  }, [element, edgeData]);

  function linkTypeChanged(event: PropertyChangedEvent) {
    const val = event.target.value as string;
    if (['multilineText', 'getAround'].includes(val)) {
      showInfoMsg(
        'Insert commas (,) in the label to break into multiple lines!',
      );
    }
    const newEdge = {
      ...element,
      type: val,
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  const arrowTypeChanged = (event: PropertyChangedEvent) => {
    const type = event.target.value;
    if (!isString(type)) {
      return;
    }
    const newEdge = isMarkerType(type)
      ? { ...element, markerEnd: { type } }
      : { ...element, markerEnd: undefined };

    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  };

  const colorLineChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newEdge = {
      ...element,
      style: { ...element.style, stroke: event.target.value },
      labelStyle: { ...element.labelStyle, fill: event.target.value },
      labelBgStyle: { ...element.labelBgStyle, stroke: event.target.value },
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  };

  const animatedChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const newEdge = {
      ...element,
      animated: event.target.checked,
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  };

  function changeX(_event: ChangeEvent<unknown>, value: number | number[]) {
    const newX = value as number;
    const newEdgeData = {
      getAroundProps: {
        x: newX,
      },
    };
    mergeEdgeData(element.id, newEdgeData);
    setX(newX);
  }

  function changeY(_event: ChangeEvent<unknown>, value: number | number[]) {
    const newY = value as number;
    const newEdgeData = {
      getAroundProps: {
        y: newY,
      },
    };
    mergeEdgeData(element.id, newEdgeData);
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
        style={sidebarStyle.formstyleflex}
      >
        <InputLabel id="linkTypeLabel">Link type</InputLabel>
        <Select
          labelId="linkTypeLabel"
          value={linkType}
          label="Link type"
          onChange={linkTypeChanged}
          style={sidebarStyle.dropdown}
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
        style={sidebarStyle.formstyleflex}
      >
        <InputLabel id="markerEnd">Arrow Head</InputLabel>
        <Select
          value={arrowType}
          label="Arrow head"
          onChange={arrowTypeChanged}
          style={sidebarStyle.dropdown}
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
        <Checkbox
          style={sidebarStyle.checkbox}
          name="animated"
          checked={animated}
          onChange={animatedChanged}
          inputProps={{ 'aria-label': 'controlled' }}
          color="primary"
        />
        <label htmlFor="animated">Animated</label>
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
          style={{ margin: '0 0 0 0.3rem' }}
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
