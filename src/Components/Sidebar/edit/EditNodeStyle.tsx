import { useEffect, useState } from 'react';
import { Checkbox, FormControl, Slider } from '@material-ui/core';
import useDebounce from '../../../hooks/useDebounce';
import type { ChangeEvent } from 'react';
import useNodeDataStore from '../../../store/useNodeDataStore';

// DOC: Edit the node style
export default function EditNodeStyle(props: { nodeId: string }) {
  const nodesData = useNodeDataStore((state) => state.nodesData);
  const { nodeId } = props;
  const [nodeSize, setNodeSize] = useState<number>(
    nodesData.get(nodeId)?.ui_props.nodeWidth || 100
  );
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

  const debouncedNodeWidth = useDebounce(nodeSize, 500);

  useEffect(() => {
    setNodeSize(nodesData.get(nodeId)?.ui_props.nodeWidth || 100);
  }, [nodeId, nodesData]);

  useEffect(
    () => {
      if (debouncedNodeWidth) {
        setElementNodeWidth(debouncedNodeWidth);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedNodeWidth] // Only call effect if debounced search term changes
  );

  function setElementNodeWidth(width: number) {
    const nodeData = nodesData.get(nodeId);
    if (nodeData && debouncedNodeWidth !== nodeData?.ui_props.nodeWidth) {
      const newNodeData = {
        ...nodeData,
        ui_props: { ...nodeData.ui_props, nodeWidth: width },
      };
      setNodeData(nodeId, newNodeData);
    }
  }

  function withImageChanged(event: ChangeEvent<HTMLInputElement>) {
    const nodeData = nodesData.get(nodeId);
    if (nodeData) {
      const newNodeData = {
        ...nodeData,
        ui_props: {
          ...nodeData.ui_props,
          withImage: event.target.checked,
        },
      };
      setNodeData(nodeId, newNodeData);
    }
  }

  function withLabelChanged(event: ChangeEvent<HTMLInputElement>) {
    const nodeData = nodesData.get(nodeId);
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
    const nodeData = nodesData.get(nodeId);
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
    const nodeData = nodesData.get(nodeId);
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
      {nodesData.get(nodeId)?.task_props.task_type !== 'note' && (
        <>
          <div>
            <label htmlFor="withImage">With Image</label>
            <Checkbox
              name="withImage"
              checked={
                nodesData.get(nodeId)?.ui_props.withImage === undefined
                  ? true
                  : !!nodesData.get(nodeId)?.ui_props.withImage
              }
              onChange={withImageChanged}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <label htmlFor="withLabel">With Label</label>
            <Checkbox
              name="withLabel"
              checked={
                nodesData.get(nodeId)?.ui_props.withLabel === undefined
                  ? true
                  : !!nodesData.get(nodeId)?.ui_props.withLabel
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
              value={nodesData.get(nodeId)?.ui_props.colorBorder || ''}
              onChange={colorBorderChanged}
              style={{ margin: '10px' }}
            />
          </div>
        </>
      )}
      {!['graphInput', 'graphOutput', 'note'].includes(
        nodesData.get(nodeId)?.task_props.task_type || ''
      ) && (
        <div>
          <div>
            <label htmlFor="moreHandles">More handles</label>
            <Checkbox
              name="moreHandles"
              checked={!!nodesData.get(nodeId)?.ui_props.moreHandles}
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
