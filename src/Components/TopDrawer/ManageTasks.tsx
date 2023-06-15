import { Grid } from '@material-ui/core';
import AddNodes from '../AddNodesDrawer/AddNodes';

export default function ManageTasks() {
  return (
    <Grid container spacing={1} direction="row" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={5}>
        <AddNodes />
      </Grid>
    </Grid>
  );
}
