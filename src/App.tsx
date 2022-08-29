import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Dashboard from './layout/Dashboard';
import 'react-reflex/styles.css';
// import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SettingsInfoDrawer from './Components/SettingsInfoDrawer';
import { Link } from 'react-router-dom';

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
      {/* <Link to="/">Editing Workflows</Link>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route index element={<SettingsInfoDrawer />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;
