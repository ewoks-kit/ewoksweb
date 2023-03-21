import { useEffect, useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';
import useDebounce from '../../../hooks/useDebounce';
import type { ChangeEvent } from 'react';
import useNodeDataStore from '../../../store/useNodeDataStore';
import { isNodeDataDefined } from '../../../utils/typeGuards';
import type { EwoksRFNodeData } from '../../../types';

// DOC: Edit the node style
export default function EditNodeStyle(props: { nodeId: string }) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  isNodeDataDefined(nodeData, nodeId);

  const [nodeSize, setNodeSize] = useState<number>(
    nodeData.ui_props.nodeWidth || 100
  );
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const debouncedNodeWidth = useDebounce(nodeSize, 500);

  useEffect(() => {
    setNodeSize(nodeData.ui_props.nodeWidth || 100);
  }, [nodeData]);

  useEffect(
    () => {
      if (debouncedNodeWidth) {
        setElementNodeWidth(debouncedNodeWidth, nodeData);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedNodeWidth] // Only call effect if debounced search term changes
  );

  function setElementNodeWidth(width: number, nodeDataProp: EwoksRFNodeData) {
    if (debouncedNodeWidth !== nodeData?.ui_props.nodeWidth) {
      const newNodeData = {
        ...nodeDataProp,
        ui_props: { ...nodeDataProp.ui_props, nodeWidth: width },
      };
      setNodeData(nodeId, newNodeData);
    }
  }

  function withImageChanged(event: ChangeEvent<HTMLInputElement>) {
    const newNodeData = {
      ...nodeData,
      ui_props: {
        ...nodeData.ui_props,
        withImage: event.target.checked,
      },
    };
    setNodeData(nodeId, newNodeData);
  }

  function withLabelChanged(event: ChangeEvent<HTMLInputElement>) {
    if (nodeData) {
      const newNodeData = {
        ...nodeData,
        ui_props: {
          ...nodeData.ui_props,
          withLabel: event.target.checked,
        },
      };
      setNodeData(nodeId, newNodeData);
    }
  }

  const colorBorderChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (nodeData) {
      const newNodeData = {
        ...nodeData,
        ui_props: {
          ...nodeData.ui_props,
          colorBorder: event.target.value,
        },
      };
      setNodeData(nodeId, newNodeData);
    }
  };

  const moreHandlesChanged = (event: ChangeEvent<HTMLInputElement>) => {
    if (nodeData) {
      const newNodeData = {
        ...nodeData,
        ui_props: {
          ...nodeData.ui_props,
          moreHandles: event.target.checked,
        },
      };
      setNodeData(nodeId, newNodeData);
    }
  };

  const changeNodeSize = (
    _event: ChangeEvent<unknown>,
    value: number | number[]
  ) => {
    if (typeof value === 'number') {
      setNodeSize(value);
    }
  };

  return (
    <FormControl variant="filled" fullWidth>
      {nodeData?.task_props.task_type !== 'note' && (
        <>
          <div>
            <label htmlFor="withImage">With Image</label>
            <Checkbox
              name="withImage"
              checked={
                nodeData?.ui_props.withImage === undefined
                  ? true
                  : !!nodeData?.ui_props.withImage
              }
              onChange={withImageChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="withLabel">With Label</label>
            <Checkbox
              name="withLabel"
              checked={
                nodeData?.ui_props.withLabel === undefined
                  ? true
                  : !!nodeData?.ui_props.withLabel
              }
              onChange={withLabelChanged}
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
              value={nodeData?.ui_props.colorBorder || ''}
              onChange={colorBorderChanged}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(
        nodeData?.task_props.task_type || ''
      ) && (
        <div>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={!!nodeData?.ui_props.moreHandles}
              onChange={moreHandlesChanged}
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
          min={40}
          max={300}
          style={{ width: '100%', paddingTop: '45px' }}
          valueLabelDisplay="on"
        />
      </div>
    </FormControl>
  );
}
