import { CircularProgress, TextField } from '@mui/material';
import { Autocomplete } from '@mui/lab';
import commonStrings from 'commonStrings.json';
import type { CSSProperties } from 'react';
import { useEffect, useState } from 'react';
import useSnackbarStore from 'store/useSnackbarStore';
import type { WorkflowDescription } from 'types';

import { useWorkflowsDLE } from '../api/workflows';
import { textForError } from '../utils';

interface Props {
  onChange: (input: WorkflowDescription) => void;
  category?: string;
  style?: CSSProperties;
}

function sortByCategory(
  descriptions: WorkflowDescription[],
): Required<WorkflowDescription>[] {
  return descriptions
    .map((desc) => ({
      ...desc,
      category: desc.category || 'NoCategory',
      label: desc.label || '',
    }))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.label.localeCompare(b.label),
    );
}

// DOC: A dropdown that can be an input as well
function WorkflowDropdown(props: Props) {
  const { onChange, category, style } = props;

  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);
  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const { data: workflows, isLoading: loading, error } = useWorkflowsDLE();
  const sortedWorkflows = sortByCategory(workflows ?? []);

  const options =
    !category || category === 'All'
      ? sortedWorkflows
      : sortedWorkflows.filter((w) => w.category === category);

  useEffect(() => {
    if (error) {
      showErrorMsg(textForError(error, commonStrings.retrieveWorkflowsError));
    }
  }, [showErrorMsg, error]);

  return (
    <Autocomplete
      style={style}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          variant="filled"
          {...params}
          label="Quick open"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          inputProps={{ ...params.inputProps, 'aria-label': 'Quick open' }}
        />
      )}
      options={options}
      isOptionEqualToValue={(option, valueSelect) => option.id === valueSelect.id}
      groupBy={(option) => option.category}
      inputValue={inputValue}
      onInputChange={(event, value) => {
        setInputValue(value);
      }}
      onChange={(event, newValue) => {
        onChange(newValue);
        setTimeout(() => {
          setInputValue('');
        }, 200);
      }}
      getOptionLabel={(option) => option.label || option.id}
      placeholder="Quick open"
      disableClearable
      blurOnSelect
    />
  );
}

export default WorkflowDropdown;
