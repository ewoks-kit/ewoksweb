import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import type { Edge } from 'reactflow';
import { useReactFlow } from 'reactflow';

import { useUpdateEdge } from '../../../general/hooks';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import styles from './EditLinkStyle.module.css';
import MarkerEndControl from './MarkerEndControl';

export default function EditLinkStyle(element: Edge) {
  const { setEdges, getEdges } = useReactFlow();
  const updateEdge = useUpdateEdge();

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);
  const mergeEdgeData = useEdgeDataStore((state) => state.mergeEdgeData);

  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);

  const linkType = element.type || 'default';
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

    updateEdge({
      ...element,
      type: val,
    });
  }

  function handleColorLineChange(event: ChangeEvent<HTMLInputElement>) {
    const newEdge = {
      ...element,
      style: { ...element.style, stroke: event.target.value },
      labelStyle: { ...element.labelStyle, fill: event.target.value },
      labelBgStyle: { ...element.labelBgStyle, stroke: event.target.value },
    };
    updateEdge(newEdge);
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

  return (
    <>
      <FormControl className={styles.container} variant="filled" fullWidth>
        <InputLabel id="linkTypeLabel">Link type</InputLabel>
        <Select
          className={styles.dropdown}
          variant="standard"
          labelId="linkTypeLabel"
          value={linkType}
          label="Link type"
          onChange={handleLinkTypeChange}
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
      <MarkerEndControl edge={element} />
      <SidebarCheckbox
        value={animated}
        onChange={(checked) =>
          updateEdge({
            ...element,
            animated: checked,
          })
        }
        label="Animated"
      />
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
