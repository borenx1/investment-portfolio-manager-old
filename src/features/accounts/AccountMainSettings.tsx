import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import EditIcon from '@material-ui/icons/Edit';
import AddEditAssetDialog, { FormFields } from './AddEditAssetDialog';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import { changeAccountingCurrency, selectActiveAccountAccountingCurrency } from './accountsSlice';

function AccountMainSettings() {
  const [accountingCurrencyDialogOpen, setAccountingCurrencyDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const accountingCurrency = useSelector(selectActiveAccountAccountingCurrency);

  const handleChangeAccountingCurrency = (fields: FormFields) => {
    dispatch(changeAccountingCurrency({currency: fields}));
    setAccountingCurrencyDialogOpen(false);
  };

  return (
    <React.Fragment>
      <SettingsSection>
        <IconButtonHeading
          variant="h6"
          gutterBottom
          title={'Accounting Currency'}
          icon={<EditIcon fontSize="small" />}
          onClick={() => setAccountingCurrencyDialogOpen(true)}
        />
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
                <TableCell>{ accountingCurrency?.name }</TableCell>
                <TableCell align="center">{ accountingCurrency?.ticker }</TableCell>
                <TableCell align="center">{ accountingCurrency?.precision }</TableCell>
                <TableCell align="center">{ accountingCurrency?.pricePrecision }</TableCell>
                <TableCell align="center">{ accountingCurrency?.isCurrency ? 'Yes' : 'No' }</TableCell>
                <TableCell align="center">{ accountingCurrency?.symbol }</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </SettingsSection>
      <AddEditAssetDialog
        open={accountingCurrencyDialogOpen}
        onDialogClose={() => setAccountingCurrencyDialogOpen(false)}
        asset={accountingCurrency}
        onSubmit={handleChangeAccountingCurrency}
      />
    </React.Fragment>
  );
}

export default AccountMainSettings;