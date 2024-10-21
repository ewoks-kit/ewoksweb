import InfoIcon from '@mui/icons-material/Info';
import { Card, CardContent, Table, TableBody } from '@mui/material';
import Button from '@mui/material//Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useMap } from '@react-hookz/web';
import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import commonStrings from '../../../commonStrings.json';
import GraphFormDialog from '../../../general/forms/GraphFormDialog';
import { useSaveWorkflow } from '../../../general/hooks';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useWorkflowStore from '../../../store/useWorkflowStore';
import SuspenseBoundary from '../../../suspense/SuspenseBoundary';
import { textForError } from '../../../utils';
import AddEntryRow from '../../Sidebar/table/controls/AddEntryRow';
import type { EngineDropdownOption } from '../models';
import styles from './ExecutionDialog.module.css';
import ExecutionOptions from './ExecutionOptions';
import InputTable from './InputTable';
import type { ExecutionInputTableRow } from './models';
import { EMPTY_INPUT } from './models';
import { execute } from './utils';

interface Props {
  open: boolean;
  onClose: (value?: string) => void;
}

export default function ExecutionDialog(props: Props) {
  const { onClose, open } = props;

  const inputRows = useMap<string, ExecutionInputTableRow>();
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const showWarningMsg = useSnackbarStore((state) => state.showWarningMsg);
  const [engine, setEngine] = useState<EngineDropdownOption>('default');
  const [worker, setWorker] = useState<string>('');
  const { isDialogOpen, setDialogOpen, handleSave } = useSaveWorkflow();
  const navigate = useNavigate();

  async function handleSaveExecute() {
    try {
      const success = await handleSave();

      if (success) {
        handleExecute();
      }
    } catch (saveError) {
      showErrorMsg(textForError(saveError, commonStrings.savingError));
    }
  }

  function handleExecute() {
    const { workflowInfo } = useWorkflowStore.getState();
    const { id: workflowId } = workflowInfo;
    if (!workflowId) {
      showWarningMsg('Please open a workflow in the canvas to execute');
      return;
    }
    try {
      execute(workflowId, [...inputRows.values()], engine, worker);
      navigate('/monitor', { state: { workflow: workflowId } });
    } catch (executeError) {
      showErrorMsg(textForError(executeError, 'Error in executing workflow.'));
    }
  }

  return (
    <Dialog maxWidth="xl" fullWidth open={open} onClose={() => onClose()}>
      <SuspenseBoundary>
        <GraphFormDialog
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
          onSuccess={handleExecute}
        />
      </SuspenseBoundary>
      <DialogTitle>Execute a workflow</DialogTitle>
      <DialogContent>
        <Card variant="outlined">
          <CardContent>
            <h4>Workflow Inputs</h4>
            <InputTable rows={inputRows} />
            <Table>
              <TableBody>
                <AddEntryRow
                  onClick={() => inputRows.set(nanoid(), EMPTY_INPUT)}
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
