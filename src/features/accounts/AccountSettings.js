import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import AccountMainSettings from './AccountMainSettings';

const useStyles = makeStyles(theme => ({
  root: {

  },
}));

function AccountSettings(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <Fragment>
      <Container className={classes.root}>
        <Box my={2}>
          <Typography variant="h4">Account Settings</Typography>
        </Box>
        <Box my={2}>
          <AccountMainSettings />
        </Box>
        <Box my={2}>
          <Divider variant="middle" />
        </Box>
      </Container>
    </Fragment>
  );
}

export default AccountSettings;