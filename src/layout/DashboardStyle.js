import { makeStyles } from '@material-ui/core/styles';
// keep it on a const in case I need to change it during editing
const drawerWidth = 290;

const DashboardStyle = makeStyles((theme) => ({
  verticalRule: {
    borderLeft: '1px solid #7685dd',
    height: '84%', // '50px',
    color: 'wight',
  },
  openFileButton: {
    backgroundColor: '#96a5f9',
  },
  formControl: {
    minWidth: '220px',
    backgroundColor: '#7685dd',
    borderRadius: '4px',
  },

  sidebarForm: {
    minWidth: '230px',
  },

  root: {
    display: 'flex',
    // width: '100%',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    backgroundColor: '#3f51b5',
    height: '7vh',
  },
  appBar: {
    // height: '7vh',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },

  title: {
    flexGrow: 1,
  },

  appBarSpacer: theme.mixins.toolbar,
  content: {
    // width: '100%',
    flexGrow: 1,
    // height: '100vh',
    overflow: 'auto',
    // height: '98vh',
  },
  container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(0),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: '93vh',
    padding_top: '7vh', // 45,
  },

  detailsLabels: {
    padding: '8px 0px',
    wordBreak: 'break-word',
  },

  executionSide: {
    margin: '8px 5px',
    wordBreak: 'break-word',
    width: '98%',
  },
}));

export default DashboardStyle;
