import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Controller, useForm } from 'react-hook-form';
import { useReactFlow } from 'reactflow';

import {
  postWorkflow,
  putWorkflow,
  useInvalidateWorkflows,
} from '../../api/workflows';
import commonStrings from '../../commonStrings.json';
import useStore from '../../store/useStore';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { GraphDetails } from '../../types';
import { GraphFormAction } from '../../types';
import {
  getEdgesData,
  getNodesData,
  rfToEwoks,
  textForError,
} from '../../utils';
import { useTasks } from '../../api/tasks';
import FormField from './FormField';
import type { GraphFields } from './models';
import { enrichWithData } from './utils';

interface Props {
  elementToEdit: GraphDetails;
  action: GraphFormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function GraphFormDialog(props: Props) {
  const rfInstance = useReactFlow();
  const { isOpen, onClose, action, elementToEdit } = props;

  const { handleSubmit, reset, control, formState } = useForm<GraphFields>({
    defaultValues: { identifier: elementToEdit.label },
  });

  const resetLoadedGraphs = useStore((state) => state.resetLoadedGraphs);
  const setRootWorkflow = useStore((state) => state.setRootWorkflow);
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const tasks = useTasks();

  const invalidateWorkflows = useInvalidateWorkflows();

  function handleClose() {
    onClose();
  }

  const onSubmit = handleSubmit(async (data: GraphFields) => {
    const { identifier, overwrite } = data;
    const nodesData = getNodesData();
    const edgesData = getEdgesData();

    const ewoksGraph = rfToEwoks({
      graph: { ...elementToEdit, id: identifier, label: identifier },
      nodes: rfInstance.getNodes().map((n) => enrichWithData(n, nodesData)),
      links: rfInstance.getEdges().map((e) => enrichWithData(e, edgesData)),
    });

    try {
      if (overwrite) {
        await putWorkflow(ewoksGraph);
      } else {
        const { data: newGraph } = await postWorkflow(ewoksGraph);
        setRootWorkflow(newGraph, rfInstance, tasks, 'fromServer');
        resetLoadedGraphs();
      }
      invalidateWorkflows();

      showSuccessMsg('Graph saved successfully!');

      reset();
      handleClose();
    } catch (error) {
      showErrorMsg(textForError(error, commonStrings.savingError));
    }
  });

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit}>
        <DialogTitle>Give the new workflow identifier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The workflow will be saved to the server with the identifier you
            provide.
          </DialogContentText>
          {formState.errors.identifier && (
            <Alert severity="error">Please give an identifier !</Alert>
          )}
          <Controller
            name="identifier"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <FormField label="Identifier" {...field} />}
          />
          {[
            GraphFormAction.newGraphOrOverwrite,
            GraphFormAction.cloneGraph,
          ].includes(action) && (
            <Controller
              name="overwrite"
              control={control}
              render={({ field }) => (
                <div>
                  <b>Overwrite existing workflow with the same identifier</b>
                  <Checkbox {...field} />
                </div>
              )}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              reset();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save workflow</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
