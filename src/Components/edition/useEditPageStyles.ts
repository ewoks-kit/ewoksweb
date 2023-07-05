import { makeStyles } from '@material-ui/core/styles';

export const useEditPageStyles = makeStyles((theme) => ({
  openFileButton: {
    '&:hover': {
      backgroundColor: '#303f9f',
    },
  },

  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
    minHeight: 0,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  appBar: {
    minHeight: '64px',
  },

  title: {
    flexGrow: 1,
  },

  isDisabled: {
    cursor: 'default',
    '&:hover': {
      textDecoration: 'none',
    },
    color: 'red',
  },

  content: {
    display: 'flex',
    height: '100%',
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

  mainArea: {
    display: 'flex',
    flex: '1 1 0%',
    minHeight: 0,
  },
}));
