import { useState } from 'react';
import { Box, Grid, Paper, styled } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { useIcons } from 'api/icons';
import IconList from './IconList';
import IconControls from './IconControls';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: 'rgb(246, 248, 249)',
  color: theme.palette.text.secondary,
}));

const useStyles = makeStyles(() =>
  createStyles({
    imgHolder: {
      overflow: 'hidden',
      overflowWrap: 'break-word',
      position: 'relative',
      textAlign: 'center',
      color: 'black',
      display: 'flex',
    },
    button: {
      margin: '8px',
    },
  })
);

export default function ManageIcons() {
  const classes = useStyles();

  const [selectedIcon, setSelectedIcon] = useState('');

  const { icons } = useIcons();

  return (
    <Box>
      <Grid container spacing={1} direction="row" alignItems="center">
        <Grid item xs={12} sm={12} md={8} lg={6}>
          <Item>
            <IconList
              icons={icons}
              selectedIcon={selectedIcon}
              setSelectedIcon={setSelectedIcon}
              imgHolderClassName={classes.imgHolder}
            />
          </Item>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={3}>
          <Item>
            <IconControls
              selectedIcon={selectedIcon}
              buttonClassName={classes.button}
            />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
