import React from 'react';

import DashboardStyle from '../layout/DashboardStyle';
import FormControl from '@material-ui/core/FormControl';
import AutocompleteDrop from '../Components/AutocompleteDrop';
import GetFromServerButtons from './GetFromServerButtons';

const useStyles = DashboardStyle;

export default function GetFromServer(props) {
  const classes = useStyles();
  const { workflowIdInAutocomplete } = props;

  const [workflowId, setWorkflowId] = React.useState('');

  const setInputValue = (workflowDetails) => {
    if (workflowDetails && workflowDetails.id) {
      setWorkflowId(workflowDetails.id || '');
      workflowIdInAutocomplete(workflowDetails.id || '');
    }
  };

  return (
    <>
      <FormControl
        variant="standard"
        // TODO: remove if build problem is resolved
        style={{
          minWidth: '220px',
          backgroundColor: '#7685dd',
          borderRadius: '4px',
        }}
        className={classes.formControl}
      >
        <AutocompleteDrop
          setInputValue={setInputValue}
          placeholder="Workflows"
          category=""
        />
      </FormControl>

      <GetFromServerButtons
        workflowId={workflowId}
        showButtons={[true, false]}
      />
    </>
  );
}
