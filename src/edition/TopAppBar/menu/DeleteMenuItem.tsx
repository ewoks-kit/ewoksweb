import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  deleteWorkflow,
  useInvalidateWorkflowDescriptions,
} from '../../../api/workflows';
import commonStrings from '../../../commonStrings.json';
import ConfirmDialog from '../../../general/ConfirmDialog';
import useSnackbarStore from '../../../store/useSnackbarStore';
import useStore from '../../../store/useStore';
import { textForError } from '../../../utils';
import ActionMenuItem from './ActionMenuItem';

function DeleteMenuItem() {
  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const [, setSearchParams] = useSearchParams();
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  return (
    <>
      <ConfirmDialog
        title={`Delete workflow with id: "${displayedWorkflowInfo.id}"?`}
        content={`You are about to delete the workflow with id: "${displayedWorkflowInfo.id}".
        Please make sure that it is not used as a sub-workflow in other workflows!
        Do you agree to continue?`}
        open={openAgreeDialog}
        onClose={() => setOpenAgreeDialog(false)}
        onConfirm={async () => {
          if (!displayedWorkflowInfo.id) {
            return;
          }
          try {
            await deleteWorkflow(displayedWorkflowInfo.id);
            invalidateWorkflowDescriptions();

            showSuccessMsg(
              `Workflow ${displayedWorkflowInfo.id} successfully deleted!`,
            );
            setSearchParams({});
          } catch (error) {
            showErrorMsg(textForError(error, commonStrings.deletingError));
          }
        }}
      />

      <ActionMenuItem
        onClick={() => setOpenAgreeDialog(true)}
        disabled={
          !rootWorkflowId || rootWorkflowId !== displayedWorkflowInfo.id
        }
        icon={Delete}
        label="Delete workflow"
      />
    </>
  );
}

export default DeleteMenuItem;
