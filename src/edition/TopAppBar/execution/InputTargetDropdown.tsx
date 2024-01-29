import { Select } from '@mui/material';

import useNodeDataStore from '../../../store/useNodeDataStore';
import type { ExecutionInputTableRow } from './models';

interface Props {
  row: ExecutionInputTableRow;
  onTargetChange: (row: ExecutionInputTableRow, newTarget: string) => void;
}

function InputTargetDropdown(props: Props) {
  const { row, onTargetChange } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  return (
    <Select
      variant="standard"
      native
      defaultValue={row.label}
      onChange={(ev) => {
        onTargetChange(row, ev.target.value);
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
