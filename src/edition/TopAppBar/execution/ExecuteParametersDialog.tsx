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
import type { Options, RowValue } from '../../../types';
import { RowType } from '../../../types';
import { textForError } from '../../../utils';
import { assertDefined } from '../../../utils/typeGuards';
import AddEntryRow from '../../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../../Sidebar/table/controls/TypeSelectCell';
import MultiTypeEditCell from '../../Sidebar/table/MultiTypeEditCell';
import StrOrNumEditCell from '../../Sidebar/table/StrOrNumEditCell';
import { calcNodeInputOptions } from '../../Sidebar/table/utils';
import type { EngineDropdownOption } from '../models';
import ExecuteParamsTableHeader from './ExecuteParamsTableHeader';
import styles from './ExecutionDialog.module.css';
import ExecutionOptions from './ExecutionOptions';
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
  const [worker, setWorker] = useState<string>('');
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
      execute(rootWorkflowId, [...inputRows.values()], engine, worker);
      navigate('/monitor', { state: { workflow: rootWorkflowId } });
    } catch (executeError) {
      showErrorMsg(textForError(executeError, 'Error in executing workflow.'));
    }
  }

  function handleTargetChange(rowId: string, newTarget: InputTarget) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);

    inputRows.set(rowId, { ...oldInput, target: newTarget });
  }

  function handleNameChange(newName: string | number, rowId: string) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);
    inputRows.set(rowId, { ...oldInput, name: newName });
  }

  function handleValueChange(newValue: RowValue, rowId: string) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);
    inputRows.set(rowId, { ...oldInput, value: newValue });
  }

  function handleTypeChange(newType: RowType, rowId: string) {
    const oldInput = inputRows.get(rowId);
    assertDefined(oldInput);
    inputRows.set(rowId, {
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
    <Dialog maxWidth="xl" fullWidth open={open} onClose={() => onClose()}>
      <DialogTitle>Execute a workflow</DialogTitle>
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
                      <StrOrNumEditCell
                        value={inputData.name}
                        onChange={(newName) => handleNameChange(newName, rowId)}
                        options={calcOptions(inputData.target)}
                        ariaLabel="Edit input name"
                      />

                      <MultiTypeEditCell
                        value={inputData.value}
                        type={inputData.type}
                        onChange={(newValue) =>
                          handleValueChange(newValue, rowId)
                        }
                        disable={inputData.type === RowType.Null}
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
                    inputRows.set(rowId, EMPTY_INPUT);
                  }}
                  colSpan={4}
                />
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <ExecutionOptions
          engine={engine}
          setEngine={setEngine}
          worker={worker}
          setWorker={setWorker}
        />
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
