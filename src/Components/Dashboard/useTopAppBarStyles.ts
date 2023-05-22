import { makeStyles } from '@material-ui/core';

export const useTopAppBarStyles = makeStyles((theme) => ({
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
    height: '5%',
    minHeight: '64px',
    zIndex: theme.zIndex.drawer + 1,
  },
}));
