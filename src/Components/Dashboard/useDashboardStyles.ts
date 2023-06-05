import { makeStyles } from '@material-ui/core/styles';

export const useDashboardStyles = makeStyles((theme) => ({
  openFileButton: {
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },

  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
  },
  toolbar: {
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
    minHeight: '64px',
  },

  title: {
    flexGrow: 1,
  },

  icon: {
    marginTop: theme.spacing(1.5),
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },

  isDisabled: {
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
    color: 'red',
  },

  appBarSpacer: theme.mixins.toolbar,
  content: {
    display: 'flex',
    height: '100%',
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
    padding_top: '7vh',
  },

  detailsLabels: {
    padding: '2px 0px',
    wordBreak: 'break-word',
  },

  executionSide: {
    margin: '8px 5px',
    wordBreak: 'break-word',
    width: '98%',
  },

  styleLinkDropdowns: {
    minWidth: '150px',
  },

  reflexSplitter: {
    display: 'flex',
    alignItems: 'center',
    width: '0.325rem !important',
    backgroundColor: 'rgb(233, 235, 247) !important',
    borderLeftColor: '#cfcfe1 !important',
    borderRightColor: '#cfcfe1 !important',
    color: '#777',
    cursor: 'col-resize !important',
    transition: 'none',
  },

  reflexContainer: {
    display: 'flex',
    minHeight: 0,
  },

  nodeDetails: {
    backgroundColor: '#e9ebf7',
    borderRadius: '10px 0 0 10px',
    border: '#96a5f9',
    borderStyle: 'solid none solid solid',
    padding: '4px',
    marginBottom: '10px',
  },

  mainArea: {
    display: 'flex',
    flex: '1 1 0%',
    minHeight: 0,
  },
}));
