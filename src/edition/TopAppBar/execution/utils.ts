import { executeWorkflow } from '../../../api/workflows';
import type { EngineDropdownOption } from '../models';
import type { ExecutionInputTableRow } from './models';
import { DROPDOWN_TO_SERVER_ENGINE } from './models';

function hasDefinedProperties(item: ExecutionInputTableRow) {
  return item.name !== '' && item.value !== '' && item.value !== undefined;
}

export async function execute(
  workflowId: string,
  inputsRows: ExecutionInputTableRow[],
  engine: EngineDropdownOption,
) {
  const inputs = inputsRows
    .filter(hasDefinedProperties)
    .map(({ name, value, target }) => {
      if (target === 'All nodes') {
        return { name, value, all: true };
      }

      if (target === 'All input nodes') {
        return { name, value };
      }

      return { name, value, id: target.id };
    });

  await executeWorkflow(workflowId, {
    engine: DROPDOWN_TO_SERVER_ENGINE[engine],
    inputs,
  });
}
