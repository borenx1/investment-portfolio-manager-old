import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import AddEditAssetDialog from './AddEditAssetDialog';

function AccountSettings(props) {
  const [baseCurrencyDialogOpen, setBaseCurrencyDialogOpen] = useState(false);

  return (
    <Fragment>
      <Container>
        <Typography variant="h4">Account Settings</Typography>
        <Grid container>
          <Grid item xs={12}>
            <Button onClick={() => setBaseCurrencyDialogOpen(true)}>Edit Base Currency</Button>
          </Grid>
        </Grid>
      </Container>
      <AddEditAssetDialog open={baseCurrencyDialogOpen} onDialogClose={() => setBaseCurrencyDialogOpen(false)} />
    </Fragment>
  );
}

export default AccountSettings;