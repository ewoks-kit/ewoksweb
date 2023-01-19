import IntegratedSpinner from '../General/IntegratedSpinner';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import useStore from '../../store/useStore';
import FormDialog from '../General/FormDialog';
import type { Dispatch, SetStateAction } from 'react';
import type { FormAction } from '../../types';

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
  const graphRF = useStore((state) => state.graphRF);

  return (
    <>
      <FormDialog
        elementToEdit={graphRF}
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
        <CloudUploadIcon />
      </IntegratedSpinner>
    </>
  );
}
