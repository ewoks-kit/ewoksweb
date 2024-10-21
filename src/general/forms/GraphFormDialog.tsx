import { Alert } from '@mui/material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useReactFlow } from '@xyflow/react';
import { flushSync } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';

import {
  postWorkflow,
  useInvalidateWorkflowDescriptions,
} from '../../api/workflows';
import commonStrings from '../../commonStrings.json';
import useSnackbarStore from '../../store/useSnackbarStore';
import useStore from '../../store/useStore';
import useWorkflowHistory from '../../store/useWorkflowHistory';
import {
  getEdgesData,
  getNodesData,
  textForError,
  toEwoksWorkflow,
} from '../../utils';
import FormField from './FormField';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GraphFormDialog(props: Props) {
  const [, setSearchParams] = useSearchParams();
  const rfInstance = useReactFlow();
  const { isOpen, onClose, onSuccess } = props;

  const elementToEdit = useStore((state) => state.displayedWorkflowInfo);

  const { handleSubmit, reset, control, formState } = useForm({
    defaultValues: { name: elementToEdit.id },
  });
  const { resetWorkflowHistory } = useWorkflowHistory();

  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();

  function handleClose() {
    onClose();
  }

  const onSubmit = handleSubmit(async (data) => {
    const { name } = data;

    const workflow = toEwoksWorkflow(
      { ...elementToEdit, id: name },
      rfInstance.getNodes(),
      rfInstance.getEdges(),
      getNodesData(),
      getEdgesData(),
    );

    try {
      await postWorkflow(workflow);
      invalidateWorkflowDescriptions();

      showSuccessMsg('Graph saved successfully!');

      reset();
      handleClose();
      // `flushSync` forces React to reset the workflow history _before_ navigating, to make sure the user doesn't see
      // the "unsaved changes" prompt - cf. https://gitlab.esrf.fr/workflow/ewoks/ewoksweb/-/issues/265)
      flushSync(() => resetWorkflowHistory());
      setSearchParams({ workflow: name });
      onSuccess?.();
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
