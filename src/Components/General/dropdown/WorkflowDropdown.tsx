import type { WorkflowDescription } from 'types';

import useStore from 'store/useStore';
import FetchingDropdown from './FetchingDropdown';
import { useState } from 'react';

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
  const [value, setValue] = useState<WorkflowDescription>({
    id: '',
    label: '',
    category: '',
  });

  const workflows = useStore((state) => state.allWorkflows);

  const { onChange, category } = props;

  const sortedWorkflows = sortByCategory(workflows);

  const options =
    !category || category === 'All'
      ? sortedWorkflows
      : sortedWorkflows.filter((w) => w.category === category);

  return (
    <FetchingDropdown
      value={value}
      options={options}
      getOptionSelected={(option, valueSelect) => option.id === valueSelect.id}
      groupBy={(option) => option.category || ''}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange(newValue);
        }
        setTimeout(() => {
          setValue({ id: '', label: '', category: '' });
        }, 200);
      }}
      getOptionLabel={(option) => option.label || ''}
      placeholder="Quick open"
    />
  );
}

export default WorkflowDropdown;
