import Typography from '@material-ui/core/Typography';
import DashboardStyle from '../layout/DashboardStyle';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import Link from '@material-ui/core/Link';
import state from '../store/state';

const useStyles = DashboardStyle;

export default function SubgraphsStack() {
  const classes = useStyles();

  const recentGraphs = state((state) => state.recentGraphs);
  const setGraphRF = state((state) => state.setGraphRF);
  const setSubgraphsStack = state((state) => state.setSubgraphsStack);
  const subgraphsStack = state((state) => {
    return state.subgraphsStack;
  });

  const goToGraph = (e) => {
    e.preventDefault();
    // console.log(e.target.text, e.target.id, recentGraphs);
    setSubgraphsStack({ id: e.target.id, label: e.target.text });
    const subgraph = recentGraphs.find((gr) => gr.graph.id === e.target.id);

    // if (!subgraph) { // Uncomment if-else or delete if not used
    //   setGraphRF({
    //     graph: subgraph.graph,
    //     nodes: toRFEwoksNodes(subgraph, []),
    //     links: toRFEwoksLinks(subgraph, []),
    //   });
    // } else {
    setGraphRF(subgraph);
    // }
  };

  return (
    <Typography
      component="h1"
      variant="h6"
      color="inherit"
      noWrap
      className={classes.title}
    >
      <Breadcrumbs aria-label="breadcrumb" color="secondary">
        {subgraphsStack[0] &&
          subgraphsStack.map((gr) => (
            <Link
              underline="hover"
              color="textPrimary"
              href="/"
              id={gr.id}
              key={gr.id}
              // value={gr.id} // Uncomment
              onClick={goToGraph}
            >
              {gr.label}
            </Link>
          ))}
      </Breadcrumbs>
      {subgraphsStack[0] && subgraphsStack[subgraphsStack.length - 1].label}
    </Typography>
  );
}
