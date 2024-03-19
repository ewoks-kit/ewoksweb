import type { SelectChangeEvent } from '@mui/material';
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
import type { Edge, EdgeMarkerType } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useReactFlow } from 'reactflow';

import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import {
  assertEdgeDataDefined,
  isMarkerType,
  isString,
} from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';

function getArrowType(
  markerEnd: EdgeMarkerType | undefined,
): MarkerType | 'none' {
  if (!markerEnd) {
    return 'none';
  }

  if (isString(markerEnd)) {
    return isMarkerType(markerEnd) ? markerEnd : 'none';
  }

  return markerEnd.type;
}

// DOC: Edit the link style
export default function EditLinkStyle(element: Edge) {
  const { setEdges, getEdges } = useReactFlow();

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);

  const linkType = element.type || 'default';
  const arrowType = getArrowType(element.markerEnd);
  const animated = !!element.animated;
  const colorLine = element.style?.stroke || '#96a5f9';
  const { x = 80, y = 80 } = edgeData.getAroundProps || {};

  function handleLinkTypeChange(event: SelectChangeEvent) {
    const val = event.target.value;
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

  function handleArrowTypeChange(event: SelectChangeEvent) {
    const type = event.target.value;
    if (!isString(type)) {
      return;
    }
    const newEdge = isMarkerType(type)
      ? { ...element, markerEnd: { type } }
      : { ...element, markerEnd: '' };

    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  function handleColorLineChange(event: ChangeEvent<HTMLInputElement>) {
    const newEdge = {
      ...element,
      style: { ...element.style, stroke: event.target.value },
      labelStyle: { ...element.labelStyle, fill: event.target.value },
      labelBgStyle: { ...element.labelBgStyle, stroke: event.target.value },
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  function handleAnimatedChange(event: ChangeEvent<HTMLInputElement>) {
    const newEdge = {
      ...element,
      animated: event.target.checked,
    };
    setEdges([...getEdges().filter((edg) => edg.id !== element.id), newEdge]);
  }

  function handleXChange(_event: Event, value: number | number[]) {
    const newX = value as number;
    const newEdgeData = {
      getAroundProps: {
        x: newX,
      },
    };
    mergeEdgeData(element.id, newEdgeData);
  }

  function handleYChange(_event: Event, value: number | number[]) {
    const newY = value as number;
    const newEdgeData = {
      getAroundProps: {
        y: newY,
      },
    };
    mergeEdgeData(element.id, newEdgeData);
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
          variant="standard"
          labelId="linkTypeLabel"
          value={linkType}
          label="Link type"
          onChange={handleLinkTypeChange}
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
          onClick={() => applyLinkTypeToAll()}
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
          variant="standard"
          value={arrowType}
          label="Arrow head"
          onChange={handleArrowTypeChange}
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
          onClick={() => applyArrowTypeToAll()}
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
          onChange={handleAnimatedChange}
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
          onChange={handleColorLineChange}
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
            onChange={handleXChange}
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
            onChange={handleYChange}
            min={-200}
            max={200}
            style={{ width: '90%' }}
          />
        </div>
      )}
    </>
  );
}
