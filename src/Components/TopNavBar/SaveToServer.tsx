import IntegratedSpinner from '../General/IntegratedSpinner';
import SaveIcon from '@material-ui/icons/Save';
import useStore from '../../store/useStore';
import FormDialog from '../General/FormDialog';
import type { Dispatch, SetStateAction } from 'react';
import type { FormAction } from '../../types';
import { useKeyboardEvent } from '@react-hookz/web';

interface SaveToServerProps {
  saveToServer: () => Promise<void>;
  action: FormAction;
  open: boolean;
  setOpenSaveDialog: Dispatch<SetStateAction<boolean>>;
}

// DOC: Save to server button with its spinner
export default function SaveToServer({
  saveToServer,
  action,
  open,
  setOpenSaveDialog,
}: SaveToServerProps) {
  const graphInfo = useStore((state) => state.graphInfo);

  useKeyboardEvent(
    (e) => (e.ctrlKey || e.metaKey) && e.key === 's',
    (e) => {
      e.preventDefault();
      void saveToServer();
    },
    []
  );

  return (
    <>
      <FormDialog
        elementToEdit={graphInfo}
        action={action}
        open={open}
        setOpenSaveDialog={setOpenSaveDialog}
      />
      <IntegratedSpinner
        tooltip="Save to Server"
        action={() => null}
        getting={false}
        onClick={() => {
          void (async () => {
            await saveToServer();
          })();
        }}
      >
        <SaveIcon data-cy="saveToServer" />
      </IntegratedSpinner>
    </>
  );
}
