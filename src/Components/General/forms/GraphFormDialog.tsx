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
import type { Dispatch, SetStateAction } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useReactFlow } from 'reactflow';

import { postWorkflow, putWorkflow } from '../../../api/api';
import commonStrings from '../../../commonStrings.json';
import useStore from '../../../store/useStore';
import type { GraphDetails, GraphFormAction } from '../../../types';
import {
  getEdgesData,
  getNodesData,
  rfToEwoks,
  textForError,
} from '../../../utils';
import FormField from './FormField';
import type { GraphFields } from './models';
import { enrichWithData } from './utils';

interface Props {
  elementToEdit: GraphDetails;
  action: GraphFormAction;
  open: boolean;
  setOpenSaveDialog: Dispatch<SetStateAction<boolean>>;
}

export default function GraphFormDialog(props: Props) {
  const rfInstance = useReactFlow();
  const { open: isOpen, setOpenSaveDialog, action, elementToEdit } = props;

  const { handleSubmit, reset, control, formState } = useForm<GraphFields>({
    defaultValues: { identifier: elementToEdit.label },
  });

  const setCanvasGraphChanged = useStore((st) => st.setCanvasGraphChanged);
  const initGraph = useStore((state) => state.initGraph);
  const resetRecentGraphs = useStore((state) => state.resetRecentGraphs);
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);
  const setGettingFromServer = useStore((st) => st.setGettingFromServer);

  function handleClose() {
    setOpenSaveDialog(false);
    setGettingFromServer(false);
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
        setCanvasGraphChanged(false);
      } else {
        const { data: newGraph } = await postWorkflow(ewoksGraph);
        initGraph(newGraph, 'fromServer', rfInstance);
        resetRecentGraphs();
      }

      setOpenSnackbar({
        open: true,
        text: 'Graph saved successfully!',
        severity: 'success',
      });

      reset();
      handleClose();
    } catch (error) {
      setOpenSnackbar({
        open: true,
        text: textForError(error, commonStrings.savingError),
        severity: 'error',
      });
      setGettingFromServer(false);
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
          {['newGraphOrOverwrite', 'cloneGraph'].includes(action) && (
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
