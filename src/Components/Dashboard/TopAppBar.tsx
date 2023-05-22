import { AppBar, Toolbar } from '@material-ui/core';
import type { PropsWithChildren } from 'react';
import GetFromServer from '../General/GetFromServer';
import ProgressBar from '../General/ProgressBar';
import SubgraphsStack from '../TopNavBar/SubgraphsStack';

interface Props {
  classes: { appBar: string; toolbar: string };
}

function TopAppBar(props: PropsWithChildren<Props>) {
  const { classes, children } = props;

  return (
    <AppBar position="static" className={classes.appBar}>
      <Toolbar className={classes.toolbar}>
        <SubgraphsStack />
        <GetFromServer />

        {children}
      </Toolbar>
      <ProgressBar />
    </AppBar>
  );
}

export default TopAppBar;
