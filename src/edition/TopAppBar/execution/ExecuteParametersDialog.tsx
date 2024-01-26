import InfoIcon from '@mui/icons-material/Info';
import {
  Card,
  CardContent,
  FormControl,
  Select,
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

import type {
  Engine,
  ExecutionParams,
  NodeExecutionInput,
  ObjectEditDialogContent,
} from '../../../api/models';
import { executeWorkflow } from '../../../api/workflows';
import DraggableDialog from '../../../general/DraggableDialog';
import { useSaveWorkflow } from '../../../general/hooks';
import useNodeDataStore from '../../../store/useNodeDataStore';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import { textForError } from '../../../utils';
import AddEntryRow from '../../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../../Sidebar/table/controls/TypeSelectCell';
import CustomTableCell from '../../Sidebar/table/CustomTableCell';
import TableCellInEditMode from '../../Sidebar/table/TableCellInEditMode';
import { isClass } from '../../Sidebar/table/utils';
import type { EngineDropdownOption } from '../models';
import { hasDefinedProperties } from '../utils';
import ExecuteParamsTableHeader from './ExecuteParamsTableHeader';
import styles from './ExecutionDialog.module.css';
import ExecutionEngine from './ExecutionEngine';

interface ExecuteDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
}

export interface ExecutionInputTableRow extends NodeExecutionInput {
  type?: string;
  rowId: string;
}

export const DROPDOWN_TO_SERVER_ENGINE: Record<EngineDropdownOption, Engine> = {
  dask: 'dask',
  default: null,
  pypushflow: 'ppf',
};

export default function ExecuteParametersDialog(props: ExecuteDialogProps) {
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

  async function execute(params?: ExecutionParams) {
    const { rootWorkflowId } = useStore.getState();
    if (!rootWorkflowId) {
      showWarningMsg('Please open a workflow in the canvas to execute');
      return;
    }
    try {
      await executeWorkflow(rootWorkflowId, params);
      navigate('/monitor');
    } catch (error) {
      // Keep logging in console for debugging when talking with a user
      /* eslint-disable no-console */
      console.log(error);
      showErrorMsg('Execution could not start!');
    }
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
    }

    // Only execute if handleSave is successful
    try {
      const inputs: NodeExecutionInput[] = perNodeInputs
        .filter(hasDefinedProperties)
        .map((input) => {
          return {
            name: input.name,
            value: input.value,
            ...(input.label &&
              !['All nodes', 'All input nodes'].includes(input.label) && {
                id: input.id,
              }),
            ...(input.label === 'All nodes' && { all: true }),
          };
        });

      execute({
        engine: DROPDOWN_TO_SERVER_ENGINE[engine],
        inputs,
      });
    } catch (executeError) {
      showErrorMsg(textForError(executeError, 'Error in executing workflow.'));
    }
  }

  function handleChangeNodeTarget(
    input: ExecutionInputTableRow,
    targetNodeId: string,
  ) {
    const newInputRow = {
      ...input,
      label: nodesData.get(targetNodeId)?.ewoks_props.label || '',
      id: targetNodeId,
    };

    const updatedInputs = perNodeInputs.map((inp) =>
      inp.id === input.id ? newInputRow : inp,
    );

    setPerNodeInputs(updatedInputs);
  }

  function handleRowAddition() {
    setPerNodeInputs([
      ...perNodeInputs,
      {
        rowId: nanoid(),
        label: 'All nodes',
        id: '',
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

  function onListOrDict(id: string, index: number): unknown {
    if (perNodeInputs[index].type === 'list') {
      if (Array.isArray(perNodeInputs[index].value)) {
        return perNodeInputs[index].value;
      }
      return [];
    }

    if (
      typeof perNodeInputs[index].value === 'object' &&
      !Array.isArray(perNodeInputs[index].value)
    ) {
      return perNodeInputs[index].value;
    }
    return {};
  }

  function handleValueEdit(inputRow: ExecutionInputTableRow, index: number) {
    if (inputRow.type && ['list', 'dict'].includes(inputRow.type)) {
      showInputEditDialog(
        inputRow.rowId,
        inputRow.type === 'list' ? 'Edit list' : 'Edit dict',
        onListOrDict(inputRow.rowId || '', index),
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

  function calcTypeAndValues(nodeId: string | undefined): TypeOfValues {
    if (!nodeId) {
      return { typeOfInput: 'input', values: [], requiredValues: [] };
    }

    return {
      typeOfInput: isClass(nodesData.get(nodeId)) ? 'select' : 'input',
      values: [
        ...(nodesData.get(nodeId)?.task_props.required_input_names || []),
        ...(nodesData.get(nodeId)?.task_props.optional_input_names || []),
      ],
      requiredValues:
        nodesData.get(nodeId)?.task_props.required_input_names || [],
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
                    {perNodeInputs.map((inputData, index) => (
                      <TableRow key={inputData.rowId}>
                        <TableCell align="left" size="small">
                          <FormControl>
                            <Select
                              variant="standard"
                              native
                              defaultValue={inputData.label}
                              onChange={(ev) => {
                                handleChangeNodeTarget(
                                  inputData,
                                  ev.target.value,
                                );
                              }}
                            >
                              <option value="All nodes">All nodes</option>
                              <option value="All input nodes">
                                All input nodes
                              </option>
                              <optgroup label="Nodes by label">
                                {[...nodesData].map(([nodeId, nodeData]) => (
                                  <option value={nodeId} key={nodeId}>
                                    {nodeData.ewoks_props.label} ({nodeId})
                                  </option>
                                ))}
                              </optgroup>
                            </Select>
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
                        <TableCell align="left" size="small">
                          <TableCellInEditMode
                            index={0}
                            name="name"
                            onChange={handleNameChange}
                            {...props}
                            row={{
                              ...inputData,
                              rowId: inputData.rowId,
                            }}
                            typeOfValues={calcTypeAndValues(inputData.id)}
                          />
                        </TableCell>

                        <CustomTableCell
                          index={index}
                          row={{ ...inputData, rowId: inputData.rowId }}
                          name="value"
                          onChange={handleValueChange}
                          onEdit={() => handleValueEdit(inputData, index)}
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
          The workflow will be saved before excution.
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
