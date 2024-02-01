import InfoIcon from '@mui/icons-material/Info';
import {
  Card,
  CardContent,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import Button from '@mui/material//Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMap } from '@react-hookz/web';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSaveWorkflow } from '../../../general/hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import type { RowChangeEvent, TypeOfValues } from '../../../types';
import { RowType } from '../../../types';
import { textForError } from '../../../utils';
import { assertDefined } from '../../../utils/typeGuards';
import AddEntryRow from '../../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../../Sidebar/table/controls/TypeSelectCell';
import NameTableCell from '../../Sidebar/table/NameTableCell';
import { isClass } from '../../Sidebar/table/utils';
import ValueTableCell from '../../Sidebar/table/ValueTableCell';
import type { EngineDropdownOption } from '../models';
import ExecuteParamsTableHeader from './ExecuteParamsTableHeader';
import styles from './ExecutionDialog.module.css';
import ExecutionEngine from './ExecutionEngine';
import InputTargetDropdown from './InputTargetDropdown';
import type { ExecutionInputTableRow, InputTarget } from './models';
import { EMPTY_INPUT } from './models';
import { execute } from './utils';

interface Props {
  open: boolean;
  onClose: (value?: string) => void;
}

export default function ExecuteParametersDialog(props: Props) {
  const { onClose, open } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  const inputRows = useMap<string, ExecutionInputTableRow>();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const [engine, setEngine] = useState<EngineDropdownOption>('default');
  const { handleSave } = useSaveWorkflow();
  const navigate = useNavigate();

  async function handleSaveExecute() {
    try {
      await handleSave();
    } catch (saveError) {
      showErrorMsg(
        textForError(
          saveError,
          'Error in saving workflow. Please check connectivity with the server!',
        ),
      );
      return;
    }

    const { rootWorkflowId } = useStore.getState();
    if (!rootWorkflowId) {
      showWarningMsg('Please open a workflow in the canvas to execute');
      return;
    }
    try {
      execute(rootWorkflowId, [...inputRows.values()], engine);
      navigate('/monitor');
    } catch (executeError) {
      showErrorMsg(textForError(executeError, 'Error in executing workflow.'));
    }
  }

  function handleTargetChange(rowId: string, newTarget: InputTarget) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);

    inputRows.set(rowId, { ...oldInput, target: newTarget });
  }

  function handleNameChange(e: RowChangeEvent, rowId: string) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);
    inputRows.set(rowId, { ...oldInput, name: e.target.value });
  }

  function handleValueChange(e: RowChangeEvent, rowId: string) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);
    inputRows.set(rowId, { ...oldInput, value: e.target.value });
  }

  function handleTypeChange(newType: RowType, rowId: string) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);
    inputRows.set(rowId, {
      ...oldInput,
      value: newType === RowType.Null ? 'null' : '',
      type: newType,
    });
  }

  function calcTypeAndValues(target: InputTarget): TypeOfValues {
    if (typeof target === 'string') {
      return { typeOfInput: 'input', values: [], requiredValues: [] };
    }

    const nodeData = nodesData.get(target.id);

    return {
      typeOfInput: isClass(nodeData) ? 'select' : 'input',
      values: [
        ...(nodeData?.task_props.required_input_names || []),
        ...(nodeData?.task_props.optional_input_names || []),
      ],
      requiredValues: nodeData?.task_props.required_input_names || [],
    };
  }

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle>Execution Parameters</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <h4>Workflow Inputs</h4>
            <div>
              <Table
                aria-label="Execution parameters table"
                size="small"
                padding="normal"
              >
                <ExecuteParamsTableHeader />
                <TableBody>
                  {[...inputRows.entries()].map(([rowId, inputData]) => (
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
                      <NameTableCell
                        row={inputData}
                        onChange={(e) => handleNameChange(e, rowId)}
                        typeOfValues={calcTypeAndValues(inputData.target)}
                      />

                      <ValueTableCell
                        row={inputData}
                        onChange={(e) => handleValueChange(e, rowId)}
                        allowBoolAndNumberInputs
                      />
                      <TableCell align="left" size="small">
                        <RemoveRowButton
                          onClick={() => inputRows.delete(rowId)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <Table>
              <TableBody>
                <AddEntryRow
                  onClick={() => {
                    const rowId = nanoid();
                    inputRows.set(rowId, {
                      rowId,
                      ...EMPTY_INPUT,
                    });
                  }}
                  colSpan={4}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ExecutionEngine engine={engine} setEngine={setEngine} />
      </DialogContent>
      <div className={styles.saveWarning}>
        <InfoIcon fontSize="small" />
        The workflow will be saved before execution.
      </div>
      <DialogActions>
        <Button
          onClick={() => {
            handleSaveExecute();
          }}
          color="primary"
        >
          Save & Execute
        </Button>
        <Button onClick={() => onClose()} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
