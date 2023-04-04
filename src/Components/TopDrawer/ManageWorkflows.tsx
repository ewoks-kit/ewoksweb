import { Box, FormControl, Grid, Paper, styled } from '@material-ui/core';
import WorkflowDropdown from '../General/dropdown/WorkflowDropdown';
import ReactJson from 'react-json-view';
import { useState } from 'react';
import { getWorkflow } from 'api/api';
import GetFromServerButtons from '../General/GetFromServerButtons';
import type { GraphEwoks, WorkflowDescription } from 'types';
import useStore from 'store/useStore';
import CategoryDropdown from '../General/dropdown/CategoryDropdown';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
}));

export default function ManageWorkflows() {
  const initializedGraph = useStore((state) => state.initializedGraph);
  const [workflowValue, setWorkflowValue] = useState<GraphEwoks>(
    initializedGraph
  );
  const [categoryValue, setCategoryValue] = useState('');
  const setOpenSnackbar = useStore((state) => state.setOpenSnackbar);

  async function setInputWorkflowValue(workflowDetails: WorkflowDescription) {
    try {
      const response = await getWorkflow(workflowDetails.id);
      setWorkflowValue(response.data);
    } catch {
      setOpenSnackbar({
        open: true,
        text: 'Workflow could not be retrieved!',
        severity: 'success',
      });
    }
  }

  function setCategoryFilter(category: string) {
    setCategoryValue(category);
  }

  return (
    <Box>
      <Grid container spacing={1} direction="row" alignItems="center">
        <Grid item xs={12} sm={12} md={6} lg={3}>
          <Item>
            <FormControl variant="standard" fullWidth>
              <CategoryDropdown onChange={setCategoryFilter} />
            </FormControl>
            <FormControl variant="standard" fullWidth>
              <WorkflowDropdown
                onChange={(e) => {
                  setInputWorkflowValue(e);
                }}
                category={categoryValue}
              />
            </FormControl>
          </Item>
          <span style={{ display: 'flex' }}>
            <GetFromServerButtons
              workflowId={workflowValue.graph.id}
              showButtons={[true, true]}
            />
          </span>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6}>
          <Item>
            <ReactJson
              src={workflowValue}
              name="Ewoks graph"
              theme="monokai"
              collapsed
              defaultValue="graph"
              collapseStringsAfterLength={30}
              groupArraysAfterLength={15}
              enableClipboard={false}
              quotesOnKeys={false}
              style={{ backgroundColor: 'rgb(59, 77, 172)' }}
              displayDataTypes
            />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
