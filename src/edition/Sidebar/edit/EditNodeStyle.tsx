import { FormControl } from '@mui/material';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { useUpdateNodeInternals } from 'reactflow';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertNodeDataDefined } from '../../../utils/typeGuards';
import SidebarCheckbox from '../SidebarCheckbox';
import styles from './EditNodeStyle.module.css';
import NodeIconControl from './NodeIconControl';
import NodeWidthControl from './NodeWidthControl';

interface Props {
  nodeId: string;
}

export default function EditNodeStyle(props: Props) {
  const { nodeId } = props;
  const nodeData = useNodeDataStore((state) => state.nodesData.get(nodeId));
  assertNodeDataDefined(nodeData, nodeId);

  const mergeNodeData = useNodeDataStore((state) => state.mergeNodeData);
  const setNodeData = useNodeDataStore((state) => state.setNodeData);

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

  function handleNodeWidthChange(
    _event: SyntheticEvent | Event,
    value: number | number[],
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

  function handleNodeIconRemoval() {
    if (!nodeData) {
      return;
    }
    const newData = { ...nodeData };
    newData.ui_props.icon = undefined;
    // Cannot use mergeNodeData since it ignores `undefined` values when merging
    setNodeData(nodeId, newData);
  }

  const [showBorderColor, setShowBorderColor] = useState(
    !!nodeData.ui_props.colorBorder,
  );

  const isGraphIONode = ['graphInput', 'graphOutput'].includes(
    nodeData.task_props.task_type,
  );
  const isNoteNode = nodeData.task_props.task_type === 'note';
  const isRegularNode = !isGraphIONode && !isNoteNode;

  return (
    <FormControl variant="filled" fullWidth>
      <div>
        {nodeData.task_props.task_type !== 'note' && (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <SidebarCheckbox
              className={styles.withImage}
              value={
                nodeData.ui_props.withImage === undefined
                  ? true
                  : !!nodeData.ui_props.withImage
              }
              onChange={withImageChanged}
              label="With image"
            />
            <SidebarCheckbox
              value={
                nodeData.ui_props.withLabel === undefined
                  ? true
                  : !!nodeData.ui_props.withLabel
              }
              onChange={withLabelChanged}
              label="With label"
            />
          </div>
        )}
        <SidebarCheckbox
          label="With border"
          value={showBorderColor}
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
        <SidebarCheckbox
          value={!!nodeData.ui_props.moreHandles}
          onChange={moreHandlesChanged}
          label="More handles"
        />
      )}
      {!isGraphIONode && (
        <NodeWidthControl
          nodeWidth={nodeData.ui_props.nodeWidth}
          onChangeCommitted={handleNodeWidthChange}
        />
      )}
      {isRegularNode && (
        <NodeIconControl
          value={nodeData.ui_props.icon}
          onChange={handleNodeIconChange}
          onRemove={handleNodeIconRemoval}
        />
      )}
    </FormControl>
  );
}
