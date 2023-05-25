import { Button } from '@material-ui/core';
import { AddCircleOutline } from '@material-ui/icons';

interface Props {
  onClick: () => void;
}

function AddRowButton(props: Props) {
  const { onClick } = props;

  return (
    <Button
      style={{ padding: '0.25rem' }}
      aria-label="Add row"
      onClick={onClick}
      data-cy="onRowAddButton"
      endIcon={<AddCircleOutline htmlColor="#7c7c7c" />}
    >
      <span style={{ color: '#7c7c7c' }}>Add</span>
    </Button>
  );
}

export default AddRowButton;
