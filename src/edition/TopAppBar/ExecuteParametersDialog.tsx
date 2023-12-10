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
import type { InputTableRow, TypeOfValues } from 'types';

import type {
  ExecuteDialogProps,
  NodeExecutionInput,
  ObjectEditDialogContent,
} from '../../api/models';
import DraggableDialog from '../../general/DraggableDialog';
import { useSaveWorkflow } from '../../general/hooks';
import useNodeDataStore from '../../store/useNodeDataStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import { textForError } from '../../utils';
import AddEntryRow from '../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../Sidebar/table/controls/TypeSelectCell';
import CustomTableCell from '../Sidebar/table/CustomTableCell';
import TableCellInEditMode from '../Sidebar/table/TableCellInEditMode';
import { isClass } from '../Sidebar/table/utils';
import ExecuteParamsTableHeader from './ExecuteParamsTableHeader';
import ExecutionEngine from './ExecutionEngine';
import type { EngineOptions } from './models';
import { hasDefinedProperties } from './utils';

export default function ExecuteParametersDialog(props: ExecuteDialogProps) {
  const { onClose, open, executeWorkflow } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  const [perNodeInputs, setPerNodeInputs] = useState<NodeExecutionInput[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ObjectEditDialogContent>();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const [engine, setEngine] = useState<EngineOptions>('default');
  const { handleSave } = useSaveWorkflow();

  function showInputEditDialog(
    id: string,
    title: string,
    graph: unknown,
    callbackProps: { rows: InputTableRow[]; id: string },
  ) {
    if (typeof graph !== 'object' || graph === null) {
      return;
    }
    setOpenDialog(true);
    setDialogContent({
      id,
      title,
      object: graph,
      callbackProps,
    });
  }

  async function handleSaveExecute() {
    try {
      await handleSave();
      const Inputs: NodeExecutionInput[] = perNodeInputs
        .filter(hasDefinedProperties)
        .map((input) => {
          return {
            name: input.name,
            type: input.type,
            value: input.value,
            id:
              input.label &&
              ['All nodes', 'All input nodes'].includes(input.label)
                ? input.label
                : input.nodeId,
          };
        });

      executeWorkflow({
        executeArgs: { engine, perNodeInputs: Inputs },
      });
    } catch (error) {
      showErrorMsg(
        textForError(
          error,
          'Error in retrieving workflow. Please check connectivity with the server!',
        ),
      );
    }
  }

  function handleChangeNodeTarget(
    input: NodeExecutionInput,
    targetNodeId: string,
  ) {
    const newInputRow = {
      ...input,
      label: nodesData.get(targetNodeId)?.ewoks_props.label || '',
      nodeId: targetNodeId,
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
        id: nanoid(),
        label: 'All nodes',
        nodeId: '',
        name: '',
        value: '',
        type: 'string',
      },
    ]);
  }

  function handleRowDelete(input: NodeExecutionInput) {
    const newInputs = perNodeInputs.filter((inp) => inp.id !== input.id);
    setPerNodeInputs(newInputs);
  }

  function handleNameChange(
    e: { target: { name: string; value: string | number } },
    row: InputTableRow,
  ) {
    const newRows = perNodeInputs.map((inputRow) =>
      inputRow.id === row.id
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
    const { id: rowId = '' } = row;
    const newRows = perNodeInputs.map((inputRow) =>
      inputRow.id === rowId
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
    row: NodeExecutionInput,
  ) => {
    const { id: rowId = '' } = row;
    const newRows = perNodeInputs.map((inputRow) =>
      inputRow.id === rowId
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

  function handleValueEdit(inputRow: NodeExecutionInput, index: number) {
    if (inputRow.type && ['list', 'dict'].includes(inputRow.type)) {
      showInputEditDialog(
        inputRow.id || '',
        inputRow.type === 'list' ? 'Edit list' : 'Edit dict',
        onListOrDict(inputRow.id || '', index),
        { rows: perNodeInputs as InputTableRow[], id: inputRow.id },
      );
    }
  }

  function setRowValue(
    name: string,
    val: unknown,
    callbackProps: { id: string; rows: InputTableRow[] },
  ) {
    const newRows = callbackProps.rows.map((row) => {
      if (row.id === callbackProps.id) {
        return name !== ''
          ? { ...row, id: name, value: val }
          : { ...row, value: val };
      }
      return row;
    });
    setPerNodeInputs(newRows as NodeExecutionInput[]);
  }

  function calcTypeAndValues(nodeId: string | undefined): TypeOfValues {
    return {
      typeOfInput:
        nodeId && isClass(nodesData.get(nodeId)) ? 'select' : 'input',
      values: [
        ...(nodesData.get(nodeId || '')?.task_props.required_input_names || []),
        ...(nodesData.get(nodeId || '')?.task_props.optional_input_names || []),
      ],
      requiredValues:
        nodesData.get(nodeId || '')?.task_props.required_input_names || [],
    };
  }

  return (
    <>
      {/* TODO: Handle open from disk before opening the execution window for better user experience*/}
      {/* <GraphFormDialog
        elementToEdit={displayedWorkflowInfo}
        action={action}
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
      /> */}
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
                    {perNodeInputs.map((input, index) => (
                      <TableRow key={input.id}>
                        <TableCell align="left" size="small">
                          <FormControl>
                            <Select
                              variant="standard"
                              native
                              defaultValue={input.label}
                              onChange={(ev) => {
                                handleChangeNodeTarget(input, ev.target.value);
                              }}
                            >
                              <option value="All nodes">All nodes</option>
                              <option value="All input nodes">
                                All input nodes
                              </option>
                              <optgroup label="Specific Nodes">
                                {[...nodesData].map(([key, value]) => (
                                  <option value={key} key={key}>
                                    {value.ewoks_props.label}
                                  </option>
                                ))}
                              </optgroup>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TypeSelectCell
                          value={
                            perNodeInputs[index].type === 'boolean'
                              ? 'bool'
                              : perNodeInputs[index].type
                          }
                          onChange={(e) => changedTypeOfInput(e, input)}
                        />
                        <TableCell align="left" size="small">
                          <TableCellInEditMode
                            index={0}
                            name="name"
                            onChange={handleNameChange}
                            {...props}
                            row={perNodeInputs[index] as InputTableRow}
                            typeOfValues={calcTypeAndValues(input.nodeId)}
                          />
                        </TableCell>

                        <CustomTableCell
                          index={index}
                          row={input as InputTableRow}
                          name="value"
                          onChange={handleValueChange}
                          onEdit={() => handleValueEdit(input, index)}
                        />
                        <TableCell align="left" size="small">
                          <RemoveRowButton
                            onClick={() => handleRowDelete(input)}
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
          The workflow will be saved before excution.
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              await handleSaveExecute();
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
