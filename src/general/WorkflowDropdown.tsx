/* eslint-disable @typescript-eslint/no-unused-vars */
import type { WorkflowDescription } from 'types';

import { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import { useWorkflows } from '../api/workflows';

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
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
  const { category } = props;

  const [value] = useState<WorkflowDescription>();
  const [open, setOpen] = useState(false);

  const workflows = useWorkflows();
  const sortedWorkflows = sortByCategory(workflows);

  return null;
}

export default WorkflowDropdown;
