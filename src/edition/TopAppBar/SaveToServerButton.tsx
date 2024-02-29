import { IconButton, Tooltip } from '@mui/material';
import { useKeyboardEvent } from '@react-hookz/web';

import GraphFormDialog from '../../general/forms/GraphFormDialog';
import { useSaveWorkflow } from '../../general/hooks';
import tooltipText from '../../general/TooltipText';
import useStore from '../../store/useStore';
import SuspenseBoundary from '../../suspense/SuspenseBoundary';
import StatusIcon from './StatusButton';
import styles from './TopAppBar.module.css';

// DOC: Save to server button with its spinner
export default function SaveToServerButton() {
  const displayedWorkflowInfo = useStore(
    (state) => state.displayedWorkflowInfo,
  );

  const { isDialogOpen, setDialogOpen, status, setStatus, handleSave } =
    useSaveWorkflow();

  useKeyboardEvent(
    (e) => (e.ctrlKey || e.metaKey) && e.key === 's',
    (e) => {
      e.preventDefault();
      handleSave();
    },
    [],
  );

  return (
    <>
      <SuspenseBoundary>
        <GraphFormDialog
          elementToEdit={displayedWorkflowInfo}
          isOpen={isDialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </SuspenseBoundary>
      <Tooltip
        title={tooltipText('Save to server (Ctrl+S)')}
        enterDelay={500}
        arrow
      >
        <IconButton
          className={styles.saveButton}
          onClick={() => {
            void handleSave();
          }}
          aria-label="Save workflow to server"
          color="inherit"
          size="large"
        >
          <StatusIcon status={status} setStatus={setStatus} />
        </IconButton>
      </Tooltip>
    </>
  );
}
