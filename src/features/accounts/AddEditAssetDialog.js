import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  const [properties, setProperties] = useState({
    name: '',
    ticker: '',
    precision: 2,
    pricePrecision: 2,
    currency: false,
    symbol: '',
  });

  const handleOpenDialog = () => {
    console.log('dialog open');
  };

  const resetForm = () => {
    console.log('reset');
  };

  const handleSubmit = () => {
    console.log('submitted');
    resetForm();
    props.onDialogClose();
  };

  return (
    <Dialog open={props.open} onClose={props.onDialogClose} onEnter={handleOpenDialog}>
      <DialogTitle>{ `${props.edit ? 'Edit' : 'Add'} Transaction` }</DialogTitle>
      <DialogContent>
        <Grid
          container
        >
          <Grid item>
            <TextField
              type="text"
              fullWidth
              label="Asset Name"
              required
              value={properties.name}
              onChange={(e) => setProperties(p => ({...p, name: e.target.value}))}
            />
          </Grid>
        </Grid>
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

export default AddEditAssetDialog;