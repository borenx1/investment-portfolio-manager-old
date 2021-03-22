import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
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
      <Grid container spacing={1}>
        <Grid item>
          <TextField
            type="text"
            fullWidth
            label="Asset Name"
            required
            value={fields.name}
            onChange={(e) => setFields(s => ({...s, name: e.target.value}))}
          />
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditAssetDialog;