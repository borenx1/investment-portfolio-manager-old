import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AddEditDialog from '../../components/AddEditDialog';
import { addTransaction, selectActiveAccount } from '../accounts/accountsSlice';
import { Transaction, dateToString } from '../../models/account';

export interface FormFields {
  date: string;
  base: string;
  quote: string;
  baseAmount: number,
  quoteAmount: number,
  price: number,
  fee: number,
  feeCurrency: 'base' | 'quote',
  notes: string,
}

const initialFormFields: FormFields = {
  date: '',
  base: '',
  quote: '',
  baseAmount: 0,
  quoteAmount: 0,
  price: 0,
  fee: 0,
  feeCurrency: 'quote',
  notes: '',
};

interface Props {
  journal: number;
  transaction?: Transaction | null;
  open: boolean;
  onDialogClose?: () => void;
}

function AddEditTransactionDialog(props: Props) {
  const { journal, transaction, open, onDialogClose } = props;
  const [fields, setFields] = useState<FormFields>(initialFormFields);
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);

  const resetForm = () => {
    if (transaction === null || transaction === undefined) {
      setFields({
        ...initialFormFields,
        date: dateToString(new Date()),
        quote: account?.settings.accountingCurrency.ticker ?? '',
      });
    } else {
      setFields({
        date: transaction.date,
        base: transaction.base,
        baseAmount: transaction.baseAmount,
        quote: transaction.quote,
        quoteAmount: transaction.quoteAmount,
        price: transaction.quoteAmount / transaction.baseAmount,
        fee: transaction.feeBase !== 0 ? transaction.feeBase : transaction.feeQuote,
        feeCurrency: transaction.feeBase !== 0 ? 'base' : 'quote',
        notes: transaction.notes,
      });
    }
  };

  const handleSubmit = () => {
    // TODO input validation
    if (transaction === null || transaction === undefined) {
      dispatch(addTransaction({
        journal: journal,
        transaction: {
          date: fields.date,
          base: fields.base,
          baseAmount: fields.baseAmount,
          quote: fields.quote,
          quoteAmount: fields.quoteAmount,
          feeBase: 0,
          feeQuote: fields.fee,
          notes: fields.notes,
        },
      }));
    } else {

    }
    onDialogClose?.();
  };

  return (
    <AddEditDialog
      objectName={'Transaction'}
      edit={Boolean(transaction)}
      open={open}
      onClose={onDialogClose}
      onEnter={resetForm}
      onReset={resetForm}
      onSubmit={handleSubmit}
      contentMaxWidth="30rem"
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            type="datetime-local"
            size="small"
            label="Date"
            required
            value={fields.date}
            onChange={(e) => setFields(s => ({...s, date: e.target.value}))}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            fullWidth
            size="small"
            label="Amount"
            required
            value={fields.baseAmount}
            onChange={(e) => setFields(s => ({...s, baseAmount: Number(e.target.value)}))}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Asset"
            required
            value={fields.base}
            onChange={(e) => setFields(s => ({...s, base: e.target.value}))}
          >
            <MenuItem value={'USD'}>{ 'USD' }</MenuItem>
            <MenuItem value={'BTC'}>{ 'BTC' }</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            fullWidth
            size="small"
            label="Total"
            required
            value={fields.quoteAmount}
            onChange={(e) => setFields(s => ({...s, quoteAmount: Number(e.target.value)}))}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Quote Currency"
            required
            value={fields.quote}
            onChange={(e) => setFields(s => ({...s, quote: e.target.value}))}
          >
            <MenuItem value={'USD'}>{ 'USD' }</MenuItem>
            <MenuItem value={'BTC'}>{ 'BTC' }</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            fullWidth
            size="small"
            label="Price"
            required
            value={fields.price}
            onChange={(e) => setFields(s => ({...s, price: Number(e.target.value)}))}
          />
        </Grid>
        <Grid item xs={4}>
          
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            fullWidth
            size="small"
            label="Fee"
            value={fields.fee}
            onChange={(e) => setFields(s => ({...s, fee: Number(e.target.value)}))}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Fee Currency"
            value={fields.feeCurrency}
            onChange={(e) => setFields(s => ({...s, feeCurrency: e.target.value as 'base' | 'quote'}))}
          >
            <MenuItem value={'base'}>{ `Base (${fields.base})` }</MenuItem>
            <MenuItem value={'quote'}>{ `Quote (${fields.quote})` }</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            multiline
            fullWidth
            size="small"
            variant="outlined"
            label="Notes"
            value={fields.notes}
            onChange={(e) => setFields(s => ({...s, notes: e.target.value}))}
          >
            <MenuItem value={'base'}>{ 'Base' }</MenuItem>
            <MenuItem value={'quote'}>{ 'Quote' }</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditTransactionDialog;