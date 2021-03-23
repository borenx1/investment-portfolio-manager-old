import { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AddEditDialog from '../../components/AddEditDialog';

/**
 * Add or change asset dialog React function component.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - edit: Asset object to edit, null if add new asset.
 * - fields: Value of the fields in this dialog: name, ticker, precision, pricePrecision, isCurrency, symbol.
 *           Received an object with members: {name, ticker, precision, pricePrecision, isCurrency, symbol}.
 * - onFieldsChange: Callback when the value of the fields change, use this to change the state of the parent component.
 *                  Function receives the new fields object.
 * - onSubmit: Function called when the add/edit button is pressed.
 */
function AddEditAssetDialog(props) {
  const handleReset = () => {
    if (props.onFieldsChange) {
      props.onFieldsChange({
        name: '',
        ticker: '',
        precision: 2,
        pricePrecision: 2,
        isCurrency: false,
        symbol: '',
      });
    }
  };

  const handleDialogOpen = () => {
    if (props.edit) {
      if (props.onFieldsChange) {
        props.onFieldsChange({
          name: props.edit.name,
          ticker: props.edit.ticker,
          precision: props.edit.precision,
          pricePrecision: props.edit.pricePrecision,
          isCurrency: props.edit.isCurrency,
          symbol: props.edit.symbol,
        });
      }
    } else {
      handleReset();
    }
  };

  return (
    <AddEditDialog
      objectName={'Asset'}
      edit={Boolean(props.edit)}
      open={props.open}
      onClose={props.onDialogClose}
      onEnter={handleDialogOpen}
      onReset={handleReset}
      onSubmit={props.onSubmit}
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
            value={props.fields.name}
            onChange={(e) => props.onFieldsChange({...props.fields, name: e.target.value})}
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
            value={props.fields.ticker}
            onChange={(e) => props.onFieldsChange({...props.fields, ticker: e.target.value})}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="text"
            label="Symbol"
            fullWidth
            variant="outlined"
            size="small"
            value={props.fields.symbol}
            onChange={(e) => props.onFieldsChange({...props.fields, symbol: e.target.value})}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={<Checkbox />}
            checked={props.fields.isCurrency}
            onChange={(e) => props.onFieldsChange({...props.fields, isCurrency: e.target.value})}
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
            value={props.fields.precision}
            onChange={(e) => props.onFieldsChange({...props.fields, precision: e.target.value})}
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
            value={props.fields.pricePrecision}
            onChange={(e) => props.onFieldsChange({...props.fields, pricePrecision: e.target.value})}
          />
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditAssetDialog;