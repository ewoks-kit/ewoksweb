import { useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import sidebarStyle from '../sidebarStyle';
import NodeIconControl from './NodeIconControl';

// DOC: Edit the node style
export default function EditNodeStyle(props: { nodeId: string }) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);

  const [nodeSize, setNodeSize] = useState<number>(
    nodeData.ui_props.nodeWidth || 100
  );
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);

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

  function handleNodeIconChange(value: string) {
    mergeNodeData(nodeId, {
      ui_props: { icon: value },
    });
  }

  const [showBorderColor, setShowBorderColor] = useState(
    !!nodeData.ui_props.colorBorder
  );

  const isRegularNode = !['graphInput', 'graphOutput', 'note'].includes(
    nodeData.task_props.task_type
  );

  return (
    <FormControl variant="filled" fullWidth>
      <div>
        {nodeData.task_props.task_type !== 'note' && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div style={{ marginRight: '20px' }}>
              <Checkbox
                style={sidebarStyle.checkbox}
                name="withImage"
                color="primary"
                checked={
                  nodeData.ui_props.withImage === undefined
                    ? true
                    : !!nodeData.ui_props.withImage
                }
                onChange={(event) => withImageChanged(event.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <label htmlFor="withImage">With image</label>
            </div>
            <div>
              <Checkbox
                style={sidebarStyle.checkbox}
                name="withLabel"
                color="primary"
                checked={
                  nodeData.ui_props.withLabel === undefined
                    ? true
                    : !!nodeData.ui_props.withLabel
                }
                onChange={(event) => withLabelChanged(event.target.checked)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
              <label htmlFor="withLabel">With label</label>
            </div>
          </div>
        )}
        <div>
          <Checkbox
            style={sidebarStyle.checkbox}
            name="borderCheckbox"
            color="primary"
            checked={showBorderColor}
            onChange={() => {
              if (showBorderColor) {
                setShowBorderColor(false);
                colorBorderChanged('');
              } else {
                setShowBorderColor(true);
                colorBorderChanged('#000000');
              }
            }}
          />
          <label id="borderCheckboxLabel" htmlFor="borderCheckbox">
            With border
          </label>
        </div>
      </div>
      {showBorderColor && (
        <div>
          <label htmlFor="head">Border color</label>
          <input
            aria-label="Color"
            type="color"
            id="head"
            name="head"
            value={nodeData.ui_props.colorBorder || ''}
            onChange={(event) => colorBorderChanged(event.target.value)}
          />
        </div>
      )}
      {isRegularNode && (
        <div>
          <div>
            <Checkbox
              style={sidebarStyle.checkbox}
              name="moreHandles"
              color="primary"
              checked={!!nodeData.ui_props.moreHandles}
              onChange={(event) => moreHandlesChanged(event.target.checked)}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="moreHandles">More handles</label>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label htmlFor="nodeSize">Node size</label>
        <Slider
          id="nodeSize"
          color="primary"
          defaultValue={nodeSize}
          value={nodeSize}
          onChange={changeNodeSize}
          onChangeCommitted={onChangeCommitted}
          min={40}
          max={300}
          style={{ paddingTop: '45px' }}
          valueLabelDisplay="on"
        />
      </div>
      {isRegularNode && (
        <NodeIconControl
          value={nodeData.ui_props.icon}
          onChange={handleNodeIconChange}
        />
      )}
    </FormControl>
  );
}
