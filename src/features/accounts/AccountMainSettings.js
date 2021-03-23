import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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

function AccountMainSettings(props) {
  const [accountingCurrencyDialogOpen, setAccountingCurrencyDialogOpen] = useState(false);
  const [accountingCurrencyfields, setAccountingCurrencyFields] = useState({
    name: '',
    ticker: '',
    precision: '',
    pricePrecision: '',
    isCurrency: '',
    symbol: '',
  });
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const accountingCurrency = account.settings.accountingCurrency;

  const handleChangeAccountingCurrency = () => {
    // Access fields in "AddEditAssetDialog". Might need to lift state up.
    // console.log(this.fields);
    // changeAccountingCurrency({currency: {}});
    setAccountingCurrencyDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Container component={Paper}>
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
      </Container>
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