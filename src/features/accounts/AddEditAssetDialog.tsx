import { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import AddEditDialog from '../../components/AddEditDialog';
import { Asset } from "../../models/Account";

export interface FormFields {
  name: string,
  ticker: string,
  precision: number,
  pricePrecision: number,
  isCurrency: boolean;
  symbol: string;
}

const initialFormFields: FormFields = {
  name: '',
  ticker: '',
  precision: 2,
  pricePrecision: 2,
  isCurrency: false,
  symbol: '',
};

interface Props {
  open: boolean;
  onDialogClose?: React.MouseEventHandler<HTMLButtonElement>;
  asset?: Asset | null;
  onSubmit?: (fields: FormFields) => void;
}

/**
 * Add or change asset dialog React function component.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - asset: Asset object to edit, null if add new asset.
 * - onSubmit: Function called when the add/edit button is pressed.
 */
function AddEditAssetDialog(props: Readonly<Props>) {
  const { open, asset, onDialogClose, onSubmit } = props;
  const [fields, setFields] = useState(initialFormFields);

  const handleReset = () => {
    setFields(initialFormFields);
  };

  const handleDialogOpen = () => {
    if (asset) {
      setFields({
        name: asset.name,
        ticker: asset.ticker,
        precision: asset.precision,
        pricePrecision: asset.pricePrecision,
        isCurrency: asset.isCurrency,
        symbol: asset.symbol ?? '',
      });
    } else {
      handleReset();
    }
  };

  return (
    <AddEditDialog
      objectName={'Asset'}
      edit={Boolean(asset)}
      open={open}
      onClose={onDialogClose}
      onEnter={handleDialogOpen}
      onReset={handleReset}
      onSubmit={() => onSubmit?.(fields)}
      contentMaxWidth="30rem"
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
            onChange={(e) => setFields({...fields, name: e.target.value})}
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
            onChange={(e) => setFields({...fields, ticker: e.target.value})}
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
            onChange={(e) => setFields({...fields, symbol: e.target.value})}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={<Checkbox />}
            checked={fields.isCurrency}
            onChange={(e, checked) => setFields({...fields, isCurrency: checked})}
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
            onChange={(e) => setFields({...fields, precision: parseInt(e.target.value)})}
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
            onChange={(e) => setFields({...fields, pricePrecision: parseInt(e.target.value)})}
          />
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditAssetDialog;