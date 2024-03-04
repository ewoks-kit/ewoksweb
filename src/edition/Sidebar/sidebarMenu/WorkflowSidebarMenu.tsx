import DeleteWorkflowButton from './DeleteWorkflowButton';
import SaveAsButton from './SaveAsButton';

interface Props {
  onSelection: () => void;
}

export default function WorkflowSidebarMenu(props: Props) {
  const { onSelection } = props;

  return (
    <>
      <SaveAsButton />
      <DeleteWorkflowButton onSelection={onSelection} />
    </>
  );
}
