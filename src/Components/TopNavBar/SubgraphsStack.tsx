import Typography from '@material-ui/core/Typography';
import DashboardStyle from '../Dashboard/DashboardStyle';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import HomeIcon from '@material-ui/icons/Home';

import Link from '@material-ui/core/Link';
import useStore from '../../store/useStore';

const useStyles = DashboardStyle;

export default function SubgraphsStack() {
  const classes = useStyles();

  const recentGraphs = useStore((state) => state.recentGraphs);
  const setGraphRF = useStore((state) => state.setGraphRF);
  const setSubgraphsStack = useStore((state) => state.setSubgraphsStack);
  const subgraphsStack = useStore((state) => {
    return state.subgraphsStack;
  });
  const setSelectedElement = useStore((state) => state.setSelectedElement);
  // TODO: event type TBD
  const goToGraph = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubgraphsStack({
      id: (e.target as Element).id,
      label: (e.target as HTMLInputElement).value,
    });

    const subgraph = recentGraphs.find(
      (gr) => gr.graph.id === (e.target as Element).id
    );

    if (subgraph) {
      setGraphRF(subgraph);
      setSelectedElement({
        ...subgraph.graph,
      });
    }
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
        {subgraphsStack.length > 1 &&
          subgraphsStack.map((gr, index) => (
            <span key={gr.id}>
              {index === 0 && <HomeIcon className={classes.icon} />}
              <Link
                underline="hover"
                color="textPrimary"
                href="/"
                id={gr.id}
                key={gr.id}
                className={
                  index === subgraphsStack.length - 1 ? classes.isDisabled : ''
                }
                onClick={goToGraph}
                data-cy={gr.id}
              >
                {gr.label}
              </Link>
            </span>
          ))}
      </Breadcrumbs>
      {subgraphsStack.length === 1 && (
        <span data-cy={subgraphsStack[0].label}>{subgraphsStack[0].label}</span>
      )}
    </Typography>
  );
}
