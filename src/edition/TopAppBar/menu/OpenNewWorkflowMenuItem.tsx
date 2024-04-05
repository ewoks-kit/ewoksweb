import { FiberNew } from '@mui/icons-material';
import { useKeyboardEvent } from '@react-hookz/web';
import { useSearchParams } from 'react-router-dom';

import ActionMenuItem from './ActionMenuItem';

function OpenNewWorkflowMenuItem() {
  const [, setSearchParams] = useSearchParams();

  function openEmptyWorkflow() {
    setSearchParams({});
  }

  useKeyboardEvent(
    (e) =>
      (e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'n',
    (e) => {
      e.preventDefault();
      openEmptyWorkflow();
    },
    [],
  );

  return (
    <ActionMenuItem
      icon={FiberNew}
      label="New workflow"
      onClick={() => openEmptyWorkflow()}
      keyShortcut="Ctrl+Shift+N"
    />
  );
}

export default OpenNewWorkflowMenuItem;
