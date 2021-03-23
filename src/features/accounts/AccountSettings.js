import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
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
        <Typography variant="h4">Account Settings</Typography>
        <AccountMainSettings />
      </Container>
    </Fragment>
  );
}

export default AccountSettings;