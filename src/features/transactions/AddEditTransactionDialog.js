import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { addTransaction } from '../accounts/accountsSlice';
import { transaction } from '../../models/Account';

/**
 * @returns The current local date and time in "yyyy-mm-ddThh:mm:ss:SSS" format
 */
function getCurrentLocalDateTime() {
  const currentDateTime = new Date();
  return new Date(currentDateTime - currentDateTime.getTimezoneOffset() * 60 * 1000).toISOString().slice(0, 19);
}

const useStyles = makeStyles((theme) => ({
  root: {

  },
}));

function AddEditTransactionDialog(props) {
  const classes = useStyles();
  const [date, setDate] = useState('');
  const [base, setBase] = useState('');
  const [quote, setQuote] = useState('');
  const [trade, setTrade] = useState('buy');
  const [baseAmount, setBaseAmount] = useState('');
  const [quoteAmount, setQuoteAmount] = useState('');
  const [price, setPrice] = useState(0);
  const [fee, setFee] = useState(0);
  const [feeCurrency, setFeeCurrency] = useState('quote');
  const [notes, setNotes] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO input validation
    dispatch(addTransaction({
      journal: props.index,
      transaction: transaction(date, base, baseAmount, quote, quoteAmount, 0, fee, notes),
    }));
    props.onDialogClose();
  };
  const handleOpenDialog = () => {
    // Init form fields according to add or edit mode
    console.log(`Open dialog: ${props.edit ? 'Edit' : 'Add'} mode`);
    if (props.edit) {
      
    } else {
      resetForm();
    }
  }

  const resetForm = () => {
    setDate(getCurrentLocalDateTime());
    setBase('');
    setQuote('USD');
    setTrade('buy');
    setBaseAmount('');
    setQuoteAmount('');
    setPrice('');
    setFee(0);
    setFeeCurrency('quote');
    setNotes('');
  };

  return (
    <Dialog open={props.open} onClose={props.onDialogClose} onEnter={handleOpenDialog}>
      <DialogTitle>{ `${props.edit ? 'Edit' : 'Add'} Transaction` }</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                type="datetime-local"
                fullWidth
                size="small"
                label="Date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Asset"
                required
                value={base}
                onChange={(e) => setBase(e.target.value)}
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
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Quote Currency"
                required
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Trade Type"
                required
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
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
                value={fee}
                onChange={(e) => setFee(e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                select
                fullWidth
                size="small"
                label="Fee Currency"
                value={feeCurrency}
                onChange={(e) => setFeeCurrency(e.target.value)}
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              >
                <MenuItem value={'base'}>{ 'Base' }</MenuItem>
                <MenuItem value={'quote'}>{ 'Quote' }</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onDialogClose} color="primary">
          Cancel
        </Button>
        <Button onClick={resetForm} color="primary">
          Reset form
        </Button>
        <Button onClick={handleSubmit} color="primary">
          { props.edit ? 'Edit' : 'Add' }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditTransactionDialog;