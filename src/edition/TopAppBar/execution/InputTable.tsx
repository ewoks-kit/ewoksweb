import {
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

import useNodeDataStore from '../../../store/useNodeDataStore';
import type { Options, RowValue } from '../../../types';
import { RowType } from '../../../types';
import { assertDefined } from '../../../utils/typeGuards';
import RemoveRowButton from '../../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../../Sidebar/table/controls/TypeSelectCell';
import MultiTypeEditCell from '../../Sidebar/table/MultiTypeEditCell';
import StrOrNumEditCell from '../../Sidebar/table/StrOrNumEditCell';
import { calcNodeInputOptions } from '../../Sidebar/table/utils';
import ExecuteParamsTableHeader from './ExecuteParamsTableHeader';
import InputTargetDropdown from './InputTargetDropdown';
import type { ExecutionInputTableRow, InputTarget } from './models';

interface Props {
  rows: Map<string, ExecutionInputTableRow>;
}

function InputTable(props: Props) {
  const { rows } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  function handleTargetChange(rowId: string, newTarget: InputTarget) {
    const oldInput = rows.get(rowId);
    assertDefined(oldInput);

    rows.set(rowId, { ...oldInput, target: newTarget });
  }

  function handleNameChange(newName: string | number, rowId: string) {
    const oldInput = rows.get(rowId);
    assertDefined(oldInput);
    rows.set(rowId, { ...oldInput, name: newName });
  }

  function handleValueChange(newValue: RowValue, rowId: string) {
    const oldInput = rows.get(rowId);
    assertDefined(oldInput);
    rows.set(rowId, { ...oldInput, value: newValue });
  }

  function handleTypeChange(newType: RowType, rowId: string) {
    const oldInput = rows.get(rowId);
    assertDefined(oldInput);
    rows.set(rowId, {
      ...oldInput,
      value: newType === RowType.Null ? null : '',
      type: newType,
    });
  }

  function calcOptions(target: InputTarget): Options | undefined {
    if (typeof target === 'string') {
      return undefined;
    }

    const nodeData = nodesData.get(target.id);
    return calcNodeInputOptions(nodeData);
  }

  return (
    <Table
      aria-label="Execution parameters table"
      size="small"
      padding="normal"
    >
      <ExecuteParamsTableHeader />
      <TableBody>
        {[...rows.entries()].map(([rowId, inputData]) => (
          <TableRow key={rowId}>
            <TableCell align="left" size="small">
              <FormControl>
                <InputTargetDropdown
                  defaultValue={inputData.target}
                  onTargetChange={(newTarget) =>
                    handleTargetChange(rowId, newTarget)
                  }
                />
              </FormControl>
            </TableCell>
            <TypeSelectCell
              value={inputData.type}
              onChange={(newType) => handleTypeChange(newType, rowId)}
            />
            <StrOrNumEditCell
              value={inputData.name}
              onChange={(newName) => handleNameChange(newName, rowId)}
              options={calcOptions(inputData.target)}
              ariaLabel="Edit input name"
            />

            <MultiTypeEditCell
              value={inputData.value}
              type={inputData.type}
              onChange={(newValue) => handleValueChange(newValue, rowId)}
              disable={inputData.type === RowType.Null}
            />
            <TableCell align="left" size="small">
              <RemoveRowButton onClick={() => rows.delete(rowId)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default InputTable;
