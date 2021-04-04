import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import AddEditDialog from '../../components/AddEditDialog';
import { addTransaction, selectActiveAccount, selectActiveAccountAssetsAll, selectActiveAccountJournals } from '../accounts/accountsSlice';
import { Transaction, dateToString, getDecimalColumnPrecision } from '../../models/account';
import { divide, multiply, roundDown } from '../../models/math';

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
  baseAmount: NaN,
  quoteAmount: NaN,
  price: NaN,
  fee: NaN,
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
  const { journal: journalIndex, transaction, open, onDialogClose } = props;
  const [fields, setFields] = useState<FormFields>(initialFormFields);
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const journals = useSelector(selectActiveAccountJournals);
  const journal = journals[journalIndex];
  const assets = useSelector(selectActiveAccountAssetsAll);
  
  const basePrecision = getDecimalColumnPrecision(journal.columns['baseAmount'], fields.base, fields.quote, assets);
  const quotePrecision = getDecimalColumnPrecision(journal.columns['quoteAmount'], fields.base, fields.quote, assets);
  const pricePrecision = getDecimalColumnPrecision(journal.columns['price'], fields.base, fields.quote, assets);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'baseAmount') {
      setFields(s => {
        const newFields = {...s, baseAmount: roundDown(Math.max(parseFloat(e.target.value), 0), basePrecision)};
        if (s.price) {
          newFields.quoteAmount = multiply(newFields.baseAmount, s.price, quotePrecision);
        }
        return newFields;
      })
    } else if (e.target.name === 'quoteAmount') {
      setFields(s => {
        const newFields = {...s, quoteAmount: roundDown(Math.max(parseFloat(e.target.value), 0), quotePrecision)};
        if (s.baseAmount) {
          newFields.price = divide(newFields.quoteAmount, s.baseAmount);
        }
        return newFields;
      })
    } else if (e.target.name === 'price') {
      setFields(s => {
        const newFields = {...s, price: Math.max(parseFloat(e.target.value), 0)};
        if (s.baseAmount) {
          newFields.quoteAmount = multiply(newFields.price, s.baseAmount, quotePrecision);
        }
        return newFields;
      })
    }
  };

  const resetForm = () => {
    if (transaction === null || transaction === undefined) {
      setFields({
        ...initialFormFields,
        date: dateToString(new Date()),
        base: account?.assets[0]?.ticker ?? account?.settings.accountingCurrency.ticker ?? '',
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
        journal: journalIndex,
        transaction: {
          date: fields.date,
          base: fields.base,
          baseAmount: fields.baseAmount,
          quote: fields.quote,
          quoteAmount: fields.quoteAmount,
          feeBase: 0,
          feeQuote: fields.fee,
          notes: fields.notes,
          extra: {},
        },
      }));
    } else {
      // TODO
    }
    onDialogClose?.();
  };

  return (
    <AddEditDialog
      objectName="Transaction"
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
            fullWidth
            required
            value={fields.date}
            onChange={(e) => setFields(s => ({...s, date: e.target.value}))}
            InputLabelProps={{shrink: true}}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            name="baseAmount"
            fullWidth
            size="small"
            label="Amount"
            required
            helperText={fields.base && `${basePrecision} max decimal places`}
            value={isNaN(fields.baseAmount) ? '' : fields.baseAmount}
            inputProps={{min: 0, step: fields.base ? 1/Math.pow(10, basePrecision) : 1}}
            onChange={handleFieldChange}
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
            {assets.map((a) => (
              <MenuItem value={a.ticker} key={a.ticker}>{ a.ticker }</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            name="quoteAmount"
            fullWidth
            size="small"
            label="Total"
            required
            helperText={fields.quote && `${quotePrecision} max decimal places`}
            value={isNaN(fields.quoteAmount) ? '' : fields.quoteAmount}
            inputProps={{min: 0, step: fields.quote ? 1/Math.pow(10, quotePrecision) : 1}}
            onChange={handleFieldChange}
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
            {assets.map((a) => (
              <MenuItem value={a.ticker} key={a.ticker}>{ a.ticker }</MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            name="price"
            fullWidth
            size="small"
            label="Price"
            required
            value={isNaN(fields.price) ? '' : fields.price}
            onChange={handleFieldChange}
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
            value={isNaN(fields.fee) ? '' : fields.fee}
            inputProps={{min: 0, step: fields.feeCurrency === 'base' ?
              (fields.base ? 1/Math.pow(10, basePrecision) : 1) :
              (fields.quote ? 1/Math.pow(10, quotePrecision) : 1)
            }}
            helperText={
              fields.feeCurrency === 'base' ?
              (fields.base && `${basePrecision} max decimal places`) :
              (fields.quote && `${quotePrecision} max decimal places`)
            }
            onChange={(e) => setFields(s => ({
              ...s,
              fee: roundDown(Math.max(parseFloat(e.target.value), 0), fields.feeCurrency === 'base' ? basePrecision : quotePrecision),
            }))}
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
          />
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditTransactionDialog;