import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import BigNumber from 'bignumber.js';
import AddEditDialog from '../../components/AddEditDialog';
import { addTransaction, selectActiveAccount, selectActiveAccountAssetsAll, selectActiveAccountJournals } from '../accounts/accountsSlice';
import { Transaction, dateToString, getDecimalColumnPrecision } from '../../models/account';
import { roundDown } from '../../models/math';

function getTransactionType(baseAmount: number, quoteAmount: number, defaultType: TransactionType) {
  if (baseAmount > 0 && quoteAmount < 0) {
    return 'buy';
  } else if (baseAmount < 0 && quoteAmount > 0) {
    return 'sell';
  } else if (baseAmount > 0 && quoteAmount >= 0) {
    return 'income';
  } else if (baseAmount < 0 && quoteAmount <= 0) {
    return 'expense';
  }
  return defaultType;
}

type TransactionType = 'buy' | 'sell' | 'income' | 'expense';
export interface FormFields {
  date: Date;
  base: string;
  quote: string;
  baseAmount: BigNumber,
  quoteAmount: BigNumber,
  price: BigNumber,
  type: TransactionType;
  fee: BigNumber,
  feeCurrency: 'base' | 'quote',
  notes: string,
}

const initialFormFields: FormFields = {
  date: new Date(),
  base: '',
  quote: '',
  baseAmount: new BigNumber(NaN),
  quoteAmount: new BigNumber(NaN),
  price: new BigNumber(NaN),
  type: 'buy',
  fee: new BigNumber(NaN),
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

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'baseAmount') {
      setFields(s => {
        const newFields = {...s, baseAmount: roundDown(BigNumber.max(e.target.value, 0), basePrecision)};
        if (s.price.toNumber()) {
          newFields.quoteAmount = roundDown(newFields.baseAmount.times(s.price), quotePrecision);
        }
        return newFields;
      });
    } else if (e.target.name === 'quoteAmount') {
      setFields(s => {
        const newFields = {...s, quoteAmount: roundDown(BigNumber.max(e.target.value, 0), quotePrecision)};
        if (s.baseAmount.toNumber()) {
          newFields.price = newFields.quoteAmount.div(s.baseAmount);
        }
        return newFields;
      });
    } else if (e.target.name === 'price') {
      setFields(s => {
        const newFields = {...s, price: BigNumber.max(e.target.value, 0)};
        if (s.baseAmount.toNumber()) {
          newFields.quoteAmount = roundDown(newFields.price.times(s.baseAmount), quotePrecision)
        }
        return newFields;
      });
    }
  };

  const resetForm = () => {
    if (transaction === null || transaction === undefined) {
      // Add
      setFields({
        ...initialFormFields,
        date: new Date(),
        base: account?.assets[0]?.ticker ?? account?.settings.accountingCurrency.ticker ?? '',
        quote: account?.settings.accountingCurrency.ticker ?? '',
      });
    } else {
      // Edit
      setFields({
        date: new Date(transaction.date),
        base: transaction.base,
        baseAmount: new BigNumber(transaction.baseAmount).abs(),
        quote: transaction.quote,
        quoteAmount: new BigNumber(transaction.quoteAmount).abs(),
        price: new BigNumber(transaction.quoteAmount).div(new BigNumber(transaction.baseAmount)),
        type: getTransactionType(transaction.baseAmount, transaction.quoteAmount, 'buy'),
        fee: transaction.feeBase !== 0 ? new BigNumber(transaction.feeBase) : new BigNumber(transaction.feeQuote),
        feeCurrency: transaction.feeBase !== 0 ? 'base' : 'quote',
        notes: transaction.notes,
      });
    }
  };

  const handleSubmit = () => {
    // TODO input validation
    if (transaction === null || transaction === undefined) {
      // Add
      dispatch(addTransaction({
        journal: journalIndex,
        transaction: {
          date: dateToString(fields.date),
          base: fields.base,
          baseAmount: (fields.type === 'buy' || fields.type === 'income' ? fields.baseAmount : fields.baseAmount.negated()).toNumber(),
          quote: fields.quote,
          quoteAmount: (fields.type === 'sell' || fields.type === 'income' ? fields.quoteAmount : fields.quoteAmount.negated()).toNumber(),
          feeBase: fields.feeCurrency === 'base' ? fields.fee.toNumber() : 0,
          feeQuote: fields.feeCurrency === 'quote' ? fields.fee.toNumber() : 0,
          notes: fields.notes,
          extra: {},
        },
      }));
    } else {
      // Edit
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
            type={journal.columns.date.showTime ? "datetime-local" : "date"}
            size="small"
            label="Date"
            fullWidth
            required
            inputProps={{step: 1}}
            value={dateToString(fields.date, journal.columns.date.showTime)}
            onChange={(e) => setFields(s => ({...s, date: new Date(e.target.value)}))}
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
            value={fields.baseAmount.isNaN() ? '' : fields.baseAmount.toFixed()}
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
            value={fields.quoteAmount.isNaN() ? '' : fields.quoteAmount.toFixed()}
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
            value={fields.price.isNaN() ? '' : fields.price.toFixed()}
            onChange={handleFieldChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            size="small"
            label="Type"
            value={fields.type}
            onChange={(e) => setFields(s => ({...s, type: e.target.value as TransactionType}))}
          >
            <MenuItem value={'buy'}>Buy</MenuItem>
            <MenuItem value={'sell'}>Sell</MenuItem>
            <MenuItem value={'income'}>Income</MenuItem>
            <MenuItem value={'expense'}>Expense</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={8}>
          <TextField
            type="number"
            fullWidth
            size="small"
            label="Fee"
            value={fields.fee.isNaN() ? '' : fields.fee.toFixed()}
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
              fee: roundDown(BigNumber.max(e.target.value, 0), fields.feeCurrency === 'base' ? basePrecision : quotePrecision),
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