import { makeStyles, createStyles } from '@material-ui/core/styles';
import Dashboard from './layout/Dashboard';
import 'react-reflex/styles.css';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      // flexGrow: 1,
    },
  })
);

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Dashboard />
    </div>
  );
}

export default App;
