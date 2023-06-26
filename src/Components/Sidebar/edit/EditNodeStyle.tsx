import { useState } from 'react';
import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Slider,
} from '@material-ui/core';
import type { ChangeEvent } from 'react';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined, isString } from '../../../utils/typeGuards';
import { useUpdateNodeInternals } from 'reactflow';
import { useIcons } from 'api/icons';
import type { PropertyChangedEvent } from '../../../types';

// DOC: Edit the node style
export default function EditNodeStyle(props: { nodeId: string }) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);

  const [nodeSize, setNodeSize] = useState<number>(
    nodeData.ui_props.nodeWidth || 100
  );
  const { icons } = useIcons();
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const updateNodeInternals = useUpdateNodeInternals();

  function withImageChanged(checked: boolean) {
    mergeNodeData(nodeId, {
      ui_props: {
        withImage: checked,
      },
    });
  }

  function withLabelChanged(checked: boolean) {
    mergeNodeData(nodeId, {
      ui_props: {
        withLabel: checked,
      },
    });
  }

  const colorBorderChanged = (value: string) => {
    mergeNodeData(nodeId, {
      ui_props: {
        colorBorder: value,
      },
    });
  };

  const moreHandlesChanged = (checked: boolean) => {
    updateNodeInternals(nodeId);
    mergeNodeData(nodeId, {
      ui_props: {
        moreHandles: checked,
      },
    });
  };

  const changeNodeSize = (
    _event: ChangeEvent<unknown>,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      setNodeSize(value);
    }
  };

  function onChangeCommitted(
    _event: ChangeEvent<unknown>,
    value: number | number[]
  ) {
    if (typeof value === 'number') {
      mergeNodeData(nodeId, {
        ui_props: { nodeWidth: value },
      });
    }
  }

  const handleNodeIconChange = (event: PropertyChangedEvent) => {
    updateNodeInternals(nodeId);
    const iconName = event.target.value;
    if (!isString(iconName)) {
      return;
    }

    mergeNodeData(nodeId, {
      ui_props: { node_icon: iconName },
    });
  };

  return (
    <FormControl variant="filled" fullWidth>
      {nodeData.task_props.task_type !== 'note' && (
        <>
          <div>
            <label htmlFor="withImage">With Image</label>
            <Checkbox
              name="withImage"
              checked={
                nodeData.ui_props.withImage === undefined
                  ? true
                  : !!nodeData.ui_props.withImage
              }
              onChange={(event) => withImageChanged(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="withLabel">With Label</label>
            <Checkbox
              name="withLabel"
              checked={
                nodeData.ui_props.withLabel === undefined
                  ? true
                  : !!nodeData.ui_props.withLabel
              }
              onChange={(event) => withLabelChanged(event.target.checked)}
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
              value={nodeData.ui_props.colorBorder || ''}
              onChange={(event) => colorBorderChanged(event.target.value)}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(
        nodeData.task_props.task_type || ''
      ) && (
        <div>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={!!nodeData.ui_props.moreHandles}
              onChange={(event) => moreHandlesChanged(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      )}
      <div style={{ minWidth: '200px' }}>
        <label htmlFor="nodeSize">Node Size</label>
        <Slider
          id="nodeSize"
          color="primary"
          defaultValue={nodeSize}
          value={nodeSize}
          onChange={changeNodeSize}
          onChangeCommitted={onChangeCommitted}
          min={40}
          max={300}
          style={{ width: '100%', paddingTop: '45px' }}
          valueLabelDisplay="on"
        />
      </div>
      <FormControl
        variant="outlined"
        fullWidth
        // style={{ ...sidebarStyle.formstyleflex }}
      >
        <InputLabel id="replace-node-icon">Node Icon</InputLabel>
        <Select
          labelId="replace-node-icon"
          // className={classes.styleLinkDropdowns}
          value={nodeData.ui_props.node_icon ?? nodeData.ui_props.icon}
          label="Override Task Icon"
          onChange={handleNodeIconChange}
        >
          {icons.map((icon) => (
            <MenuItem value={icon.name} key={icon.name}>
              {icon.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </FormControl>
  );
}
