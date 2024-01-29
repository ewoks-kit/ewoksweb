import { Select } from '@mui/material';

import useNodeDataStore from '../../../store/useNodeDataStore';
import { assertStr } from '../../../utils/typeGuards';
import type { ExecutionInputTableRow, InputTarget } from './models';

interface Props {
  row: ExecutionInputTableRow;
  onTargetChange: (row: ExecutionInputTableRow, newTarget: InputTarget) => void;
}

function InputTargetDropdown(props: Props) {
  const { row, onTargetChange } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  return (
    <Select
      variant="standard"
      native
      defaultValue={typeof row.target === 'string' ? row.target : row.target.id}
      onChange={(ev) => {
        const newValue = ev.target.value;
        assertStr(newValue);

        if (newValue === 'All nodes' || newValue === 'All input nodes') {
          onTargetChange(row, newValue);
          return;
        }

        onTargetChange(row, { id: newValue });
      }}
    >
      <option value="All nodes">All nodes</option>
      <option value="All input nodes">All input nodes</option>
      <optgroup label="Nodes by label">
        {[...nodesData].map(([nodeId, nodeData]) => (
          <option value={nodeId} key={nodeId}>
            {nodeData.ewoks_props.label} ({nodeId})
          </option>
        ))}
      </optgroup>
    </Select>
  );
}

export default InputTargetDropdown;
