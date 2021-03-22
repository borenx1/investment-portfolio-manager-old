import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AddEditDialog from '../../components/AddEditDialog';

/**
 * Add or change asset dialog React function component.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - handleCloseDialog - Function called when the dialog requests to be closed.
 * - handleOpenDialog - Function called before the dialog is opened.
 * - edit: Asset object to edit, null if add new asset.
 */
function AddEditAssetDialog(props) {
  const [fields, setFields] = useState({
    name: '',
    ticker: '',
    precision: '',
    pricePrecision: '',
    isCurrency: '',
    symbol: '',
  });

  const resetForm = () => {
    setFields({
      name: '',
      ticker: '',
      precision: 2,
      pricePrecision: 2,
      isCurrency: false,
      symbol: '',
    });
  };

  const handleDialogOpen = () => {
    if (props.edit) {
      setFields({
        name: props.edit.name,
        ticker: props.edit.ticker,
        precision: props.edit.precision,
        pricePrecision: props.edit.pricePrecision,
        isCurrency: props.edit.isCurrency,
        symbol: props.edit.symbol,
      });
    } else {
      resetForm();
    }
  };

  const handleSubmit = () => {
    console.log('submitted');
    props.onDialogClose();
  };

  return (
    <AddEditDialog
      objectName={'Asset'}
      edit={Boolean(props.edit)}
      open={props.open}
      onClose={props.onDialogClose}
      onEnter={handleDialogOpen}
      onReset={resetForm}
      onSubmit={handleSubmit}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Asset Name"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={fields.name}
            onChange={(e) => setFields(s => ({...s, name: e.target.value}))}
          />
        </Grid>
        <Grid item xs={5}>
          <TextField
            type="text"
            label="Ticker"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={fields.ticker}
            onChange={(e) => setFields(s => ({...s, ticker: e.target.value}))}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="text"
            label="Symbol"
            fullWidth
            variant="outlined"
            size="small"
            value={fields.symbol}
            onChange={(e) => setFields(s => ({...s, symbol: e.target.value}))}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={<Checkbox />}
            checked={fields.isCurrency}
            onChange={(e) => setFields(s => ({...s, isCurrency: e.target.checked}))}
            label="Currency"
            labelPlacement="end"
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="Precision"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={fields.precision}
            onChange={(e) => setFields(s => ({...s, precision: e.target.value}))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="Price Precision"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={fields.pricePrecision}
            onChange={(e) => setFields(s => ({...s, pricePrecision: e.target.value}))}
          />
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditAssetDialog;