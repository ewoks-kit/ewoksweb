import { useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';
import type { ChangeEvent } from 'react';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import { useUpdateNodeInternals } from 'reactflow';

// DOC: Edit the node style
export default function EditNodeStyle(props: { nodeId: string }) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);

  const [nodeSize, setNodeSize] = useState<number>(
    nodeData.ui_props.nodeWidth || 100
  );
  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const updateNodeInternals = useUpdateNodeInternals();

  function handleWithImageChange(checked: boolean) {
    mergeNodeData(nodeId, {
      ui_props: {
        withImage: checked,
      },
    });
  }

  function handleWithLabelChange(checked: boolean) {
    mergeNodeData(nodeId, {
      ui_props: {
        withLabel: checked,
      },
    });
  }

  const handleColorBorderChange = (value: string) => {
    mergeNodeData(nodeId, {
      ui_props: {
        colorBorder: value,
      },
    });
  };

  const handleMoreHandlesChange = (checked: boolean) => {
    updateNodeInternals(nodeId);
    mergeNodeData(nodeId, {
      ui_props: {
        moreHandles: checked,
      },
    });
  };

  const handleDiscreteInputsOutputsChange = (checked: boolean) => {
    updateNodeInternals(nodeId);
    mergeNodeData(nodeId, {
      ui_props: {
        discreteInputsOutputs: checked,
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
              onChange={(event) => handleWithImageChange(event.target.checked)}
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
              onChange={(event) => handleWithLabelChange(event.target.checked)}
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
              onChange={(event) => handleColorBorderChange(event.target.value)}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(
        nodeData.task_props.task_type
      ) && (
        <>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={!!nodeData.ui_props.moreHandles}
              onChange={(event) =>
                handleMoreHandlesChange(event.target.checked)
              }
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
          <div>
            <label htmlFor="discreteInputsOutputs">
              Discrete Inputs-Outputs
            </label>
            <Checkbox
              name="discreteInputsOutputs"
              checked={!!nodeData.ui_props.discreteInputsOutputs}
              onChange={(event) =>
                handleDiscreteInputsOutputsChange(event.target.checked)
              }
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </>
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
    </FormControl>
  );
}
