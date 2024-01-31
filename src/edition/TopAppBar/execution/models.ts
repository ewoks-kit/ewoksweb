import type { Engine } from '../../../api/models';
import type { EngineDropdownOption } from '../models';

export type InputTarget = { id: string } | 'All nodes' | 'All input nodes';

export interface ExecutionInputTableRow {
  name: string | number;
  value: unknown;
  target: InputTarget;
  type: string;
  rowId: string;
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
  type: 'string',
};
