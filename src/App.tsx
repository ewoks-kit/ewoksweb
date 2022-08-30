import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dashboard from './layout/Dashboard';
import 'react-reflex/styles.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
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
