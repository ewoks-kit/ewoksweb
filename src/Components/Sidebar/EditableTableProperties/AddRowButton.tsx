import { Button } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

interface Props {
  onClick: () => void;
  ariaLabel?: string;
}

function AddRowButton(props: Props) {
  const { onClick, ariaLabel } = props;

  return (
    <Button
      style={{ padding: '0.25rem', alignItems: 'flex-start' }}
      aria-label={ariaLabel || 'Add row'}
      onClick={onClick}
      endIcon={<AddCircleOutline htmlColor="#7c7c7c" />}
    >
      <span style={{ color: '#7c7c7c' }}>Add</span>
    </Button>
  );
}

export default AddRowButton;
