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

import { useUpdateEdge } from '../../../general/hooks';
import useEdgeDataStore from '../../../store/useEdgeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import { assertEdgeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import ColorPicker from './ColorPicker';
import styles from './EditLinkStyle.module.css';
import MarkerEndControl from './MarkerEndControl';

export default function EditLinkStyle(element: Edge) {
  const { setEdges, getEdges } = useReactFlow();
  const updateEdge = useUpdateEdge();

  const edgeData = useEdgeDataStore((state) => state.edgesData.get(element.id));
  assertEdgeDataDefined(edgeData, element.id);

  const showInfoMsg = useSnackbarStore((state) => state.showInfoMsg);

  const linkColor = element.style?.stroke;
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

  function handleColorChange(newValue: string | undefined) {
    const newEdge = {
      ...element,
      style: { ...element.style, stroke: newValue },
      labelStyle: { ...element.labelStyle, fill: newValue },
      labelBgStyle: { ...element.labelBgStyle, stroke: newValue },
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
      <div className={styles.controls}>
        <ColorPicker
          defaultColorVariable="--edge-color"
          value={linkColor}
          onChange={handleColorChange}
          label="Color"
        />
        <SidebarCheckbox
          className={styles.checkbox}
          value={animated}
          onChange={(checked) =>
            updateEdge({
              ...element,
              animated: checked,
            })
          }
          label="Animated"
        />
      </div>
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
    </>
  );
}
