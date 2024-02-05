import type { Engine } from '../../../api/models';
import type { InputTableRow } from '../../../types';
import { RowType } from '../../../types';
import type { EngineDropdownOption } from '../models';

export type InputTarget = { id: string } | 'All nodes' | 'All input nodes';

export interface ExecutionInputTableRow extends Required<InputTableRow> {
  name: string | number;
  target: InputTarget;
}

export const DROPDOWN_TO_SERVER_ENGINE: Record<EngineDropdownOption, Engine> = {
  dask: 'dask',
  default: null,
  pypushflow: 'ppf',
};

export const EMPTY_INPUT: Omit<ExecutionInputTableRow, 'rowId'> = {
  target: 'All nodes',
  name: '',
  value: '',
  type: RowType.String,
};
