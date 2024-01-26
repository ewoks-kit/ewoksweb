import type { NodeExecutionInput } from '../../../api/models';
import { executeWorkflow } from '../../../api/workflows';
import type { EngineDropdownOption } from '../models';
import { hasDefinedProperties } from '../utils';
import type { ExecutionInputTableRow } from './models';
import { DROPDOWN_TO_SERVER_ENGINE } from './models';

export async function execute(
  workflowId: string,
  inputsRows: ExecutionInputTableRow[],
  engine: EngineDropdownOption,
) {
  const inputs: NodeExecutionInput[] = inputsRows
    .filter(hasDefinedProperties)
    .map((row) => {
      return {
        name: row.name,
        value: row.value,
        ...(row.label &&
          !['All nodes', 'All input nodes'].includes(row.label) && {
            id: row.id,
          }),
        ...(row.label === 'All nodes' && { all: true }),
      };
    });

  await executeWorkflow(workflowId, {
    engine: DROPDOWN_TO_SERVER_ENGINE[engine],
    inputs,
  });
}
