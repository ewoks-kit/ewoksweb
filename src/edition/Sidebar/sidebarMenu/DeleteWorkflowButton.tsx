import { Delete } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem } from '@mui/material';
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

interface Props {
  onSelection: () => void;
}

function DeleteWorkflowButton(props: Props) {
  const { onSelection } = props;

  const [openAgreeDialog, setOpenAgreeDialog] = useState(false);

  const [, setSearchParams] = useSearchParams();
  const showSuccessMsg = useSnackbarStore((state) => state.showSuccessMsg);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);
  const invalidateWorkflowDescriptions = useInvalidateWorkflowDescriptions();
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );
  const rootWorkflowId = useStore((state) => state.rootWorkflowId);

  async function agreeCallback() {
    setOpenAgreeDialog(false);
    if (displayedWorkflowInfo.id) {
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
    }
  }

  return (
    <>
      <MenuItem
        onClick={() => setOpenAgreeDialog(true)}
        role="menuitem"
        disabled={
          !rootWorkflowId || rootWorkflowId !== displayedWorkflowInfo.id
        }
      >
        <ListItemIcon>
          <Delete fontSize="small" />
        </ListItemIcon>
        <ListItemText>Delete Workflow</ListItemText>
      </MenuItem>
      <ConfirmDialog
        title={`Delete workflow with id: "${displayedWorkflowInfo.id}"?`}
        content={`You are about to delete the workflow with id: "${displayedWorkflowInfo.id}".
        Please make sure that it is not used as a sub-workflow in other workflows!
        Do you agree to continue?`}
        open={openAgreeDialog}
        agreeCallback={() => {
          agreeCallback();
          onSelection();
        }}
        disagreeCallback={() => {
          setOpenAgreeDialog(false);
          onSelection();
        }}
      />
    </>
  );
}

export default DeleteWorkflowButton;
