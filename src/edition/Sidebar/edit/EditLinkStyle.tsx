import type { SelectChangeEvent } from '@mui/material';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import type { Edge } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import type { ChangeEvent } from 'react';

import { useUpdateEdge } from '../../../general/hooks';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import { useCssColors } from '../../hooks';
import SidebarCheckbox from '../SidebarCheckbox';
import styles from './EditLinkStyle.module.css';
import MarkerEndControl from './MarkerEndControl';

export default function EditLinkStyle(element: Edge) {
  const { setEdges, getEdges } = useReactFlow();
  const updateEdge = useUpdateEdge();

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);

  const [[edgeColor], rootRef] = useCssColors(['--edge-color']);

  const linkColor = element.style?.stroke || edgeColor;
  const linkType = element.type || 'default';
  const animated = !!element.animated;

  function handleLinkTypeChange(event: SelectChangeEvent) {
    const val = event.target.value;
    if (val === 'multilineText') {
      showInfoMsg(
        'Insert commas (,) in the label to break into multiple lines!',
      );
    }

    updateEdge({
      ...element,
      type: val,
    });
  }

  function handleColorChange(event: ChangeEvent<HTMLInputElement>) {
    const newEdge = {
      ...element,
      style: { ...element.style, stroke: event.target.value },
      labelStyle: { ...element.labelStyle, fill: event.target.value },
      labelBgStyle: { ...element.labelBgStyle, stroke: event.target.value },
    };
    updateEdge(newEdge);
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
      <FormControl
        ref={rootRef}
        className={styles.container}
        variant="filled"
        fullWidth
      >
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
      <div className={styles.colorPicker}>
        <label htmlFor="head">Color</label>
        <input
          aria-label="Color"
          type="color"
          id="head"
          name="head"
          value={linkColor}
          onChange={handleColorChange}
          style={{ margin: '0 0 0 0.3rem' }}
        />
      </div>
    </>
  );
}
