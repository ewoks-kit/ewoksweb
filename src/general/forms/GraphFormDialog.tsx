import { Alert } from '@mui/material';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import {
  postWorkflow,
  putWorkflow,
  useInvalidateWorkflowDescriptions,
  useInvalidateWorkflow,
} from '../../api/workflows';
import commonStrings from '../../commonStrings.json';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { GraphDetails } from '../../types';
import { GraphFormAction } from '../../types';
import {
  getEdgesData,
  getNodesData,
  prepareEwoksGraph,
  textForError,
} from '../../utils';
import FormField from './FormField';
import type { GraphFields } from './models';

interface Props {
  elementToEdit: GraphDetails;
  action: GraphFormAction;
  isOpen: boolean;
  onClose: () => void;
}

export default function GraphFormDialog(props: Props) {
  const [, setSearchParams] = useSearchParams();
  const rfInstance = useReactFlow();
  const { isOpen, onClose, action, elementToEdit } = props;

  const { handleSubmit, reset, control, formState } = useForm<GraphFields>({
    defaultValues: { identifier: elementToEdit.label },
  });

  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();
  const invalidateWorkflow = useInvalidateWorkflow();

  function handleClose() {
    onClose();
  }

  const onSubmit = handleSubmit(async (data: GraphFields) => {
    const { identifier, overwrite } = data;

    const ewoksGraph = prepareEwoksGraph(
      { ...elementToEdit, id: identifier },
      rfInstance.getNodes(),
      rfInstance.getEdges(),
      getNodesData(),
      getEdgesData(),
    );

    try {
      if (overwrite) {
        await putWorkflow(ewoksGraph);
      } else {
        await postWorkflow(ewoksGraph);
      }
      await invalidateWorkflowDescriptions();
      await invalidateWorkflow();

      showSuccessMsg('Graph saved successfully!');

      reset();
      handleClose();
      setSearchParams({ workflow: identifier });
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
