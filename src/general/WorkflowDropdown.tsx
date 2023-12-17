import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import type { Ref } from 'react';
import { forwardRef, useEffect } from 'react';
import type { WorkflowDescription } from 'types';

import { useWorkflowsDLE } from '../api/workflows';
import commonStrings from '../commonStrings.json';
import useSnackbarStore from '../store/useSnackbarStore';
import { textForError } from '../utils';
import styles from './WorkflowDropdown.module.css';

interface Props {
  onChange: (input: WorkflowDescription) => void;
  category?: string;
  label?: string;
}

function sortByCategory(
  descriptions: WorkflowDescription[],
): Required<WorkflowDescription>[] {
  return descriptions
    .map((desc) => ({
      ...desc,
      category: desc.category || 'No category',
      label: desc.label || '',
    }))
    .sort(
      (a, b) =>
        a.category.localeCompare(b.category) || a.label.localeCompare(b.label),
    );
}

function WorkflowDropdown(props: Props, ref: Ref<HTMLElement>) {
  const { onChange, category, label = 'Quick open' } = props;

  const showErrorMsg = useSnackbarStore((state) => state.showErrorMsg);

  const { data: workflows, isLoading, error } = useWorkflowsDLE();

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
      ref={ref}
      className={styles.quickOpen}
      openOnFocus
      autoHighlight
      loading={isLoading}
      options={options}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      getOptionLabel={(option) => option.label || option.id}
      groupBy={(option) => option.category}
      disableClearable
      blurOnSelect
      renderOption={(AutocompleteProps, option) => {
        return (
          <li {...AutocompleteProps} key={option.id}>
            {option.label || option.id}
          </li>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={label}
          InputProps={{
            ...params.InputProps,
            startAdornment: <CloudDownloadIcon className={styles.icon} />,
            endAdornment: isLoading ? (
              <CircularProgress
                className={styles.loader}
                color="inherit"
                size={20}
              />
            ) : (
              params.InputProps.endAdornment
            ),
          }}
          inputProps={{
            ...params.inputProps,
            className: styles.input,
            'aria-label': label,
          }}
        />
      )}
      // @ts-expect-error
      value={null} // prevent value from ever being set (to deal with re-opening the currently-opened workflow)
      onChange={(_, newValue) => onChange(newValue)}
    />
  );
}

export default forwardRef(WorkflowDropdown);
