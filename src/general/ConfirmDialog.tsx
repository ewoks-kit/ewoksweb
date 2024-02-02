import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  content: string;
  agreeCallback(): Promise<void> | void;
  disagreeCallback(): void;
}
// DOC: Used as an app-wide dialog when confirmation is needed. Open is a prop
export default function ConfirmDialog(props: ConfirmDialogProps) {
  const { open, title, content, setOpen } = props;

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.disagreeCallback()}>No</Button>
        <Button
          onClick={() => {
            void (async () => {
              props.agreeCallback();
            })();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
