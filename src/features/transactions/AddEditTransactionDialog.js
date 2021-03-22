import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AddEditDialog from '../../components/AddEditDialog';
import { addTransaction, selectActiveAccount } from '../accounts/accountsSlice';
import { transaction } from '../../models/Account';

/**
 * @returns The current local date and time in "yyyy-mm-ddThh:mm:ss:SSS" format.
 */
function getCurrentLocalDateTime() {
  const currentDateTime = new Date();
  return new Date(currentDateTime - currentDateTime.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 19);
}

// const useStyles = makeStyles((theme) => ({
//   root: {

//   },
// }));

function AddEditTransactionDialog(props) {
  // const classes = useStyles();
  const [fields, setFields] = useState({
    date: '',
    base: '',
    quote: '',
    trade: '',
    baseAmount: '',
    quoteAmount: '',
    price: '',
    fee: '',
    feeCurrency: '',
    notes: '',
  });
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);

  const resetForm = () => {
    setFields({
      date: getCurrentLocalDateTime(),
      base: '',
      quote: account ? account.settings.baseCurrency.ticker : '',
      trade: 'buy',
      baseAmount: '',
      quoteAmount: '',
      price: 0,
      fee: 0,
      feeCurrency: 'quote',
      notes: '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO input validation
    dispatch(addTransaction({
      journal: props.index,
      transaction: transaction(
        fields.date,
        fields.base,
        fields.baseAmount,
        fields.quote,
        fields.quoteAmount,
        0,
        fields.fee,
        fields.notes,
      ),
    }));
    resetForm();
    props.onDialogClose();
  };
  const handleOpenDialog = () => {
    // Init form fields according to add or edit mode
    if (props.edit) {
      
    } else {
      resetForm();
    }
  }

  return (
    <AddEditDialog
      objectName={'Transaction'}
      open={props.open}
      onClose={props.onDialogClose}
      onEnter={handleOpenDialog}
      onReset={resetForm}
      onSubmit={handleSubmit}
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
            onChange={(e) => setFields(s => ({...s, baseAmount: e.target.value}))}
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
            onChange={(e) => setFields(s => ({...s, quoteAmount: e.target.value}))}
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
            onChange={(e) => setFields(s => ({...s, price: e.target.value}))}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Trade Type"
            required
            value={fields.trade}
            onChange={(e) => setFields(s => ({...s, trade: e.target.value}))}
          >
            <MenuItem value={'buy'}>{ 'Buy' }</MenuItem>
            <MenuItem value={'sell'}>{ 'Sell' }</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            fullWidth
            size="small"
            label="Fee"
            value={fields.fee}
            onChange={(e) => setFields(s => ({...s, fee: e.target.value}))}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Fee Currency"
            value={fields.feeCurrency}
            onChange={(e) => setFields(s => ({...s, feeCurrency: e.target.value}))}
          >
            <MenuItem value={'base'}>{ 'Base' }</MenuItem>
            <MenuItem value={'quote'}>{ 'Quote' }</MenuItem>
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