import type { Engine, NodeExecutionInput } from '../../../api/models';
import type { EngineDropdownOption } from '../models';

export interface ExecutionInputTableRow extends NodeExecutionInput {
  type?: string;
  rowId: string;
}

export const DROPDOWN_TO_SERVER_ENGINE: Record<EngineDropdownOption, Engine> = {
  dask: 'dask',
  default: null,
  pypushflow: 'ppf',
};
