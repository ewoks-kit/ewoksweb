import { Alert } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { useReactFlow } from 'reactflow';

import {
  postWorkflow,
  useInvalidateWorkflowDescriptions,
} from '../../api/workflows';
import commonStrings from '../../commonStrings.json';
import useSnackbarStore from '../../store/useSnackbarStore';
import type { GraphDetails } from '../../types';
import {
  getEdgesData,
  getNodesData,
  prepareEwoksGraph,
  textForError,
} from '../../utils';
import FormField from './FormField';

interface Props {
  elementToEdit: GraphDetails;
  isOpen: boolean;
  onClose: () => void;
}

export default function GraphFormDialog(props: Props) {
  const [, setSearchParams] = useSearchParams();
  const rfInstance = useReactFlow();
  const { isOpen, onClose, elementToEdit } = props;

  const { handleSubmit, reset, control, formState } = useForm({
    defaultValues: { name: elementToEdit.id },
  });

  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();

  function handleClose() {
    onClose();
  }

  const onSubmit = handleSubmit(async (data) => {
    const { name } = data;

    const ewoksGraph = prepareEwoksGraph(
      { ...elementToEdit, id: name },
      rfInstance.getNodes(),
      rfInstance.getEdges(),
      getNodesData(),
      getEdgesData(),
    );

    try {
      await postWorkflow(ewoksGraph);
      invalidateWorkflowDescriptions();

      showSuccessMsg('Graph saved successfully!');

      reset();
      handleClose();
      setSearchParams({ workflow: name });
    } catch (error) {
      showErrorMsg(textForError(error, commonStrings.savingError));
    }
  });

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <form onSubmit={onSubmit}>
        <DialogTitle>Give the new workflow name</DialogTitle>
        <DialogContent>
          {formState.errors.name && (
            <Alert severity="error">Please give a name !</Alert>
          )}
          <Controller
            name="name"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <FormField label="Name" {...field} />}
          />
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
