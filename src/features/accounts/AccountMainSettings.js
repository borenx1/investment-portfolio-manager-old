import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import AddEditAssetDialog from './AddEditAssetDialog';
import { changeAccountingCurrency, selectActiveAccount } from './accountsSlice';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

function AccountMainSettings(props) {
  const classes = useStyles();
  const [accountingCurrencyDialogOpen, setAccountingCurrencyDialogOpen] = useState(false);
  const [accountingCurrencyfields, setAccountingCurrencyFields] = useState({
    name: '',
    ticker: '',
    precision: '',
    pricePrecision: '',
    isCurrency: false,
    symbol: '',
  });
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const accountingCurrency = account.settings.accountingCurrency;

  const handleChangeAccountingCurrency = () => {
    dispatch(changeAccountingCurrency({currency: {...accountingCurrencyfields}}));
    setAccountingCurrencyDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Paper component="section" elevation={0} variant="outlined" className={classes.root}>
        <Typography variant="h6">Accouting Currency</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Ticker</TableCell>
                <TableCell align="center">Precision</TableCell>
                <TableCell align="center">Price Precision</TableCell>
                <TableCell align="center">Currency</TableCell>
                <TableCell align="center">Symbol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{ accountingCurrency.name }</TableCell>
                <TableCell align="center">{ accountingCurrency.ticker }</TableCell>
                <TableCell align="center">{ accountingCurrency.precision }</TableCell>
                <TableCell align="center">{ accountingCurrency.pricePrecision }</TableCell>
                <TableCell align="center">{ accountingCurrency.isCurrency ? 'Yes' : 'No' }</TableCell>
                <TableCell align="center">{ accountingCurrency.symbol }</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => setAccountingCurrencyDialogOpen(true)}
        >Change Accounting Currency</Button>
      </Paper>
      <AddEditAssetDialog
        open={accountingCurrencyDialogOpen}
        onDialogClose={() => setAccountingCurrencyDialogOpen(false)}
        edit={accountingCurrency}
        fields={accountingCurrencyfields}
        onFieldsChange={fields => setAccountingCurrencyFields(fields)}
        onSubmit={handleChangeAccountingCurrency}
      />
    </React.Fragment>
  );
}

export default AccountMainSettings;