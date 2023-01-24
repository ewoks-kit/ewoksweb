import type { WorkflowDescription } from 'types';

import useStore from 'store/useStore';
import FetchingDropdown from './FetchingDropdown';

interface Props {
  onChange: (input: WorkflowDescription) => void;
  category?: string;
}

function sortByCategory(
  descriptions: WorkflowDescription[]
): Required<WorkflowDescription>[] {
  return descriptions
    .map((desc) => ({
      ...desc,
      category: desc.category || 'NoCategory',
      label: desc.label || '',
    }))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.label.localeCompare(b.label)
    );
}

// DOC: A dropdown that can be an input as well
function WorkflowDropdown(props: Props) {
  const workflows = useStore((state) => state.allWorkflows);

  const { onChange, category } = props;

  const sortedWorkflows = sortByCategory(workflows);

  const options =
    !category || category === 'All'
      ? sortedWorkflows
      : sortedWorkflows.filter((w) => w.category === category);

  return (
    <FetchingDropdown
      options={options}
      getOptionSelected={(option, value) => option.id === value.id}
      groupBy={(option) => option.category}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange(newValue);
        }
      }}
      getOptionLabel={(option) => option.label}
      placeholder="Open workflow"
    />
  );
}

export default WorkflowDropdown;
