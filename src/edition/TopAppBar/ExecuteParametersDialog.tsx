import {
  Card,
  CardContent,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
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
import type { EditableTableRow, TypeOfValues } from 'types';

import DraggableDialog from '../../general/DraggableDialog';
import useNodeDataStore from '../../store/useNodeDataStore';
import AddEntryRow from '../Sidebar/table/controls/AddEntryRow';
import RemoveRowButton from '../Sidebar/table/controls/RemoveRowButton';
import TypeSelectCell from '../Sidebar/table/controls/TypeSelectCell';
import CustomTableCell from '../Sidebar/table/CustomTableCell';
import TableCellInEditMode from '../Sidebar/table/TableCellInEditMode';
import styles from '../Sidebar/table/TableHeader.module.css';
import { isClass } from '../Sidebar/table/utils';
import ExecutionEngine from './ExecutionEngine';

interface ObjectEditDialogContent {
  id?: string;
  title?: string;
  object?: object;
  callbackProps: { rows: EditableTableRow[]; id: string };
}

interface ExecutionPerNodeInputs {
  name?: string | number;
  type?: string;
  value?: unknown;
  id: string;
  label?: string;
  taskIdentifier?: string;
  nodeId?: string;
}

interface ExecutionParameters {
  name: string | number;
  type?: string;
  value: unknown;
  id: string;
}

export interface ExecutionParams {
  workerOptions?: Record<string, unknown>;
  executeArgs?: { perNodeInputs?: ExecutionPerNodeInputs[]; engine?: string };
}

export interface ExecuteDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  executeWorkflow: (params?: ExecutionParams) => Promise<void>;
}

function hasDefinedProperties(
  item: ExecutionPerNodeInputs,
): item is ExecutionParameters & {
  nodeId: string;
  name: string;
  value: unknown;
  label: string;
} {
  return (
    item.nodeId !== undefined &&
    item.name !== undefined &&
    item.value !== undefined &&
    item.label !== undefined
  );
}

type EngineOptions = 'default' | 'dask' | 'ppf';

export default function ExecuteParametersDialog(props: ExecuteDialogProps) {
  const { onClose, open, executeWorkflow } = props;

  const nodesData = useNodeDataStore((state) => state.nodesData);

  const [perNodeInputs, setPerNodeInputs] = useState<ExecutionPerNodeInputs[]>(
    [],
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState<ObjectEditDialogContent>();

  const [engine, setEngine] = useState<EngineOptions>('default');

  function showEditableDialog(
    id: string,
    title: string,
    graph: unknown,
    callbackProps: { rows: EditableTableRow[]; id: string },
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

  function handleExecute() {
    const execDefaultInputs: ExecutionPerNodeInputs[] = perNodeInputs
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
      executeArgs: { engine, perNodeInputs: execDefaultInputs },
      workerOptions: {},
    });
  }

  function handleChangeNodeTarget(
    input: ExecutionPerNodeInputs,
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

  function handleRowDelete(input: ExecutionPerNodeInputs) {
    const newInputs = perNodeInputs.filter((inp) => inp.id !== input.id);
    setPerNodeInputs(newInputs);
  }

  function handleNameChange(
    e: { target: { name: string; value: string | number } },
    row: EditableTableRow,
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
    row: EditableTableRow,
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
    row: ExecutionPerNodeInputs,
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

  function handleValueEdit(inputRow: ExecutionPerNodeInputs, index: number) {
    if (inputRow.type && ['list', 'dict'].includes(inputRow.type)) {
      showEditableDialog(
        inputRow.id || '',
        inputRow.type === 'list' ? 'Edit list' : 'Edit dict',
        onListOrDict(inputRow.id || '', index),
        { rows: perNodeInputs as EditableTableRow[], id: inputRow.id },
      );
    }
  }

  function setRowValue(
    name: string,
    val: unknown,
    callbackProps: { id: string; rows: EditableTableRow[] },
  ) {
    const newRows = callbackProps.rows.map((row) => {
      if (row.id === callbackProps.id) {
        return name !== ''
          ? { ...row, id: name, value: val }
          : { ...row, value: val };
      }
      return row;
    });
    setPerNodeInputs(newRows as ExecutionPerNodeInputs[]);
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
      {dialogContent && (
        <DraggableDialog
          open={openDialog}
          content={dialogContent}
          setValue={setRowValue}
        />
      )}
      <Dialog
        maxWidth="xl"
        fullWidth
        aria-labelledby="execute-arguments-dialog"
        open={open}
        onClose={() => onClose()}
      >
        <DialogTitle>Execution Parameters</DialogTitle>
        <DialogContent>
          <Card variant="outlined" style={{ margin: '2px' }}>
            <CardContent>
              <h4>Workflow Inputs</h4>
              <div style={{ display: 'flex' }}>
                <Table
                  className={styles.table}
                  aria-label="editable table"
                  size="small"
                  padding="normal"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell
                        align="center"
                        className={styles.cell}
                        style={{ width: '25%' }}
                      >
                        <b>Node/s</b>
                      </TableCell>
                      <TableCell
                        align="center"
                        className={styles.cell}
                        style={{ width: '15%' }}
                      >
                        <b>Type</b>
                      </TableCell>
                      <TableCell
                        align="center"
                        className={styles.cell}
                        style={{ width: '30%' }}
                      >
                        <b>Name</b>
                      </TableCell>
                      <TableCell
                        align="center"
                        className={styles.cell}
                        style={{ width: '30%' }}
                      >
                        <b>Value</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {perNodeInputs.map((input, index) => (
                      <TableRow key={input.id}>
                        <TableCell
                          style={{ width: '25%' }}
                          className={styles.cell}
                          align="left"
                          size="small"
                        >
                          <FormControl sx={{ m: 1, width: '100%' }}>
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
                        <TableCell
                          style={{ width: '30%' }}
                          className={styles.cell}
                          align="left"
                          size="small"
                        >
                          <TableCellInEditMode
                            index={0}
                            name="name"
                            onChange={handleNameChange}
                            {...props}
                            row={perNodeInputs[index] as EditableTableRow}
                            typeOfValues={calcTypeAndValues(input.nodeId)}
                          />
                        </TableCell>

                        <CustomTableCell
                          index={index}
                          row={input as EditableTableRow}
                          name="value"
                          onChange={handleValueChange}
                          onEdit={() => handleValueEdit(input, index)}
                        />
                        <TableCell
                          className={styles.cell}
                          align="left"
                          size="small"
                        >
                          <RemoveRowButton
                            onDelete={() => handleRowDelete(input)}
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
          <Button onClick={handleExecute} color="primary">
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
