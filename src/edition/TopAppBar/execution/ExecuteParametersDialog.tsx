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
import { nanoid } from 'nanoid';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputTableRow, TypeOfValues } from 'types';

import type { ObjectEditDialogContent } from '../../../api/models';
import DraggableDialog from '../../../general/DraggableDialog';
import { useSaveWorkflow } from '../../../general/hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import { textForError } from '../../../utils';
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
import { execute } from './utils';

interface Props {
  open: boolean;
  onClose: (value?: string) => void;
}

export default function ExecuteParametersDialog(props: Props) {
  const { onClose, open } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  const [perNodeInputs, setPerNodeInputs] = useState<ExecutionInputTableRow[]>(
    [],
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ObjectEditDialogContent>();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const [engine, setEngine] = useState<EngineDropdownOption>('default');
  const { handleSave } = useSaveWorkflow();
  const navigate = useNavigate();

  function showInputEditDialog(
    id: string,
    title: string,
    graph: unknown,
    callbackProps: { rows: ExecutionInputTableRow[]; id: string },
  ) {
    if (typeof graph !== 'object' || graph === null) {
      return;
    }

    setOpenDialog(true);
    setDialogContent({
      id,
      title,
      object: graph,
      callbackProps: {
        id: callbackProps.id,
        rows: callbackProps.rows.map((row) => {
          return {
            rowId: row.rowId,
            name: row.name,
            value: row.value,
            type: row.type,
          };
        }),
      },
    });
  }

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
      execute(rootWorkflowId, perNodeInputs, engine);
      navigate('/monitor');
    } catch (executeError) {
      showErrorMsg(textForError(executeError, 'Error in executing workflow.'));
    }
  }

  function handleChangeNodeTarget(
    input: ExecutionInputTableRow,
    target: InputTarget,
  ) {
    const newInputRow = {
      ...input,
      target,
    };

    const updatedInputs = perNodeInputs.map((inp) =>
      inp.rowId === input.rowId ? newInputRow : inp,
    );

    setPerNodeInputs(updatedInputs);
  }

  function handleRowAddition() {
    setPerNodeInputs([
      ...perNodeInputs,
      {
        rowId: nanoid(),
        target: 'All nodes',
        name: '',
        value: '',
        type: 'string',
      },
    ]);
  }

  function handleRowDelete(input: ExecutionInputTableRow) {
    const newInputs = perNodeInputs.filter((inp) => inp.rowId !== input.rowId);
    setPerNodeInputs(newInputs);
  }

  function handleNameChange(
    e: { target: { name: string; value: string | number } },
    row: InputTableRow,
  ) {
    const newRows = perNodeInputs.map((inputRow) =>
      inputRow.rowId === row.rowId
        ? {
            ...inputRow,
            name: e.target.value,
          }
        : inputRow,
    );

    setPerNodeInputs(newRows);
  }

  function handleValueChange(
    e: { target: { name: string; value: string | number } },
    row: InputTableRow,
  ) {
    const { rowId = '' } = row;
    const newRows = perNodeInputs.map((inputRow) =>
      inputRow.rowId === rowId
        ? {
            ...inputRow,
            value: e.target.value,
          }
        : inputRow,
    );

    setPerNodeInputs(newRows);
  }

  const changedTypeOfInput = (
    e: ChangeEvent<HTMLInputElement>,
    row: ExecutionInputTableRow,
  ) => {
    const { rowId } = row;
    const newRows = perNodeInputs.map((inputRow) =>
      inputRow.rowId === rowId
        ? {
            ...inputRow,
            value: e.target.value === 'null' ? e.target.value : '',
            type: e.target.value,
          }
        : inputRow,
    );
    setPerNodeInputs(newRows);
  };

  function onListOrDict(rowId: string): unknown {
    const row = perNodeInputs.find((input) => input.rowId === rowId);
    if (!row) {
      return {};
    }

    if (row.type === 'list') {
      if (Array.isArray(row.value)) {
        return row.value;
      }
      return [];
    }

    if (typeof row.value === 'object' && !Array.isArray(row.value)) {
      return row.value;
    }
    return {};
  }

  function handleValueEdit(inputRow: ExecutionInputTableRow) {
    if (inputRow.type && ['list', 'dict'].includes(inputRow.type)) {
      showInputEditDialog(
        inputRow.rowId,
        inputRow.type === 'list' ? 'Edit list' : 'Edit dict',
        onListOrDict(inputRow.rowId),
        { rows: perNodeInputs, id: inputRow.rowId },
      );
    }
  }

  function setRowValue(
    name: string,
    val: unknown,
    callbackProps: { id: string; rows: InputTableRow[] },
  ) {
    const newRows: ExecutionInputTableRow[] = perNodeInputs.map((row) => {
      if (row.rowId === callbackProps.id) {
        return { ...row, value: val };
      }
      return row;
    });
    setPerNodeInputs(newRows);
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
    <>
      {dialogContent && (
        <DraggableDialog
          open={openDialog}
          content={dialogContent}
          setValue={setRowValue}
        />
      )}
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
                    {perNodeInputs.map((inputData) => (
                      <TableRow key={inputData.rowId}>
                        <TableCell align="left" size="small">
                          <FormControl>
                            <InputTargetDropdown
                              row={inputData}
                              onTargetChange={handleChangeNodeTarget}
                            />
                          </FormControl>
                        </TableCell>
                        <TypeSelectCell
                          value={
                            inputData.type === 'boolean'
                              ? 'bool'
                              : inputData.type || 'string'
                          }
                          onChange={(e) => changedTypeOfInput(e, inputData)}
                        />
                        <NameTableCell
                          row={inputData}
                          onChange={(e) => handleNameChange(e, inputData)}
                          typeOfValues={calcTypeAndValues(inputData.target)}
                        />

                        <ValueTableCell
                          row={inputData}
                          onChange={(e) => handleValueChange(e, inputData)}
                          onEdit={() => handleValueEdit(inputData)}
                          allowBoolAndNumberInputs
                        />
                        <TableCell align="left" size="small">
                          <RemoveRowButton
                            onClick={() => handleRowDelete(inputData)}
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
                    onClick={() => handleRowAddition()}
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
    </>
  );
}
