import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import AddEditDialog from '../../components/AddEditDialog';
import { addJournalColumn, editJournalColumn, selectActiveAccountAssetsAll, selectActiveAccountJournals } from './accountsSlice';
import {
  Journal,
  JournalColumn,
  JournalColumnRole,
  JournalColumnType,
  isDecimalColumn,
  isExtraColumn,
  isDecimalColumnDescription,
  isJournalColumnType,
  getJournalColumn,
  journalColumnRoleDisplay,
  Asset,
} from '../../models/account';
import { Divider, Typography } from '@material-ui/core';

interface DecimalColumnSettingsProps {
  price?: boolean;
  disableDescription?: boolean;
  description: string;
  onDescriptionChange?: (newValue: string) => void;
  precision: Record<string, number>;
  onPrecisionChange?: (newValue: Record<string, number>) => void;
  // ticker2 is the second ticker in the ticker pair (ticker/ticker2) for price columns
  newPrecisionFields: {ticker: string, ticker2?: string, precision: number};
  onNewPrecisionFieldsChange?: (newValue: {ticker: string, ticker2?: string, precision: number}) => void;
  onNewPrecisionFieldsReset?: () => void;
  assets?: Asset[];
}

const useStyles = makeStyles((theme) => ({
  removeButton: {
    color: theme.palette.error.main,
  },
}));

function DecimalColumnSettings(props: DecimalColumnSettingsProps) {
  const classes = useStyles();
  const {
    price,
    disableDescription,
    description,
    onDescriptionChange,
    precision,
    onPrecisionChange,
    newPrecisionFields,
    onNewPrecisionFieldsChange,
    onNewPrecisionFieldsReset,
    assets,
  } = props;

  const handleAddPrecision = () => {
    if (price) {
      if (newPrecisionFields.ticker && newPrecisionFields.ticker2 && !isNaN(newPrecisionFields.precision)) {
        onPrecisionChange?.({...precision, [`${newPrecisionFields.ticker}/${newPrecisionFields.ticker2}`]: newPrecisionFields.precision});
        onNewPrecisionFieldsReset?.();
      }
    } else {
      if (newPrecisionFields.ticker && !isNaN(newPrecisionFields.precision)) {
        onPrecisionChange?.({...precision, [newPrecisionFields.ticker]: newPrecisionFields.precision});
        onNewPrecisionFieldsReset?.();
      }
    }
    
  };

  const handleDeletePrecision = (ticker: string) => {
    const { [ticker]: _, ...newPrecision } = precision;
    onPrecisionChange?.(newPrecision);
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <TextField
          select
          label="Description"
          fullWidth
          variant="outlined"
          size="small"
          required
          disabled={disableDescription}
          value={description}
          onChange={(e) => onDescriptionChange?.(e.target.value)}
        >
          <MenuItem value="base">Base</MenuItem>
          <MenuItem value="quote">Quote</MenuItem>
          <MenuItem value="price">Price</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="subtitle1">Precision</Typography>
        <Divider />
      </Grid>
      {Object.entries(precision).map(([t, p]) => [
        <Grid item xs={6}>
          <TextField
            type="text"
            label={price ? 'Asset Pair' : 'Asset'}
            fullWidth
            variant="outlined"
            size="small"
            required
            disabled
            value={t}
          />
        </Grid>,
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Precision"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={isNaN(p) ? '' : p}
            onChange={(e) => onPrecisionChange?.({...precision, [t]: Math.max(parseInt(e.target.value), 0)})}
          />
        </Grid>,
        <Grid item xs={2}>
          <IconButton onClick={() => handleDeletePrecision(t)} className={classes.removeButton}>
            <RemoveIcon />
          </IconButton>
        </Grid>,
      ])}
      <Grid item xs={price ? 3 : 6}>
        <TextField
          select
          label={price ? 'Base' : 'Asset'}
          fullWidth
          variant="outlined"
          size="small"
          required
          value={newPrecisionFields.ticker}
          onChange={(e) => onNewPrecisionFieldsChange?.({...newPrecisionFields, ticker: e.target.value})}
        >
          {assets?.map((a) => (
            <MenuItem value={a.ticker} key={a.ticker}>{ a.ticker }</MenuItem>
          ))}
        </TextField>
      </Grid>
      {price && (
        <Grid item xs={3}>
          <TextField
            select
            label="Quote"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={newPrecisionFields.ticker2 ?? ''}
            onChange={(e) => onNewPrecisionFieldsChange?.({...newPrecisionFields, ticker2: e.target.value})}
          >
            {assets?.map((a) => (
              <MenuItem value={a.ticker} key={a.ticker}>{ a.ticker }</MenuItem>
            ))}
          </TextField>
        </Grid>
      )}
      <Grid item xs={4}>
        <TextField
          type="number"
          label="Precision"
          fullWidth
          variant="outlined"
          size="small"
          required
          value={isNaN(newPrecisionFields.precision) ? '' : newPrecisionFields.precision}
          onChange={(e) => onNewPrecisionFieldsChange?.({...newPrecisionFields, precision: Math.max(parseInt(e.target.value), 0)})}
        />
      </Grid>
      <Grid item xs={2}>
        <IconButton color="secondary" onClick={handleAddPrecision}>
          <AddIcon />
        </IconButton>
      </Grid>
    </React.Fragment>
  );
}

interface FormFields {
  name: string;
  type: string;
  hide: boolean;
  precision: Record<string, number>;
  decimalColumnDescription: string;
  showTime: boolean,
}

const initialFormFields: Readonly<FormFields> = {
  name: '',
  type: 'text',
  hide: false,
  precision: {},
  decimalColumnDescription: 'base',
  showTime: false,
};

interface Props {
  open: boolean;
  onDialogClose?: () => void;
  journal: number;
  role?: JournalColumnRole | null;
}

/**
 * React component. Add or change journal column dialog.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - index: The index of the journal selected.
 * - role: The column role of the selected journal to edit. Set to nullish value to add a new column.
 */
function AddEditJournalColumnDialog(props: Readonly<Props>) {
  const { open, onDialogClose, journal: index, role } = props;
  const [fields, setFields] = useState<FormFields>(initialFormFields);
  const [newPrecisionFields, setNewPrecisionFields] = useState<{ticker: string, precision: number}>({ticker: '', precision: 2});
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  const allAssets = useSelector(selectActiveAccountAssetsAll);
  // journalIndex is set to -1 initially
  const journal = journals[index] as Journal | undefined;
  // column is the selected column if the props index and role are valid, else undefined
  const column = (journal !== undefined && role !== null && role !== undefined) ? getJournalColumn(journal, role) : undefined;

  const handleReset = () => { 
    if (column) {
      setFields({
        name: column.name,
        type: column.type,
        hide: column.hide,
        precision: column.type === 'decimal' ? column.precision : initialFormFields.precision,
        decimalColumnDescription: column.type === 'decimal' ? column.description : initialFormFields.decimalColumnDescription,
        showTime: column.type === 'date' ? column.showTime : initialFormFields.showTime,
      });
    } else {
      setFields(initialFormFields);
    }
    handleResetNewPrecisionFields();
  };
  
  const handleResetNewPrecisionFields = () => {
    setNewPrecisionFields({ticker: '', precision: NaN});
  };

  const handleSubmit = () => {
    // Core columns cannot change type
    // Use default column type 'text' if type field is invalid
    const newType: JournalColumnType = (column && typeof role === 'string')
      ? column.type :
      (isJournalColumnType(fields.type) ? fields.type : 'text');
    // Construct the new column piece by piece
    const partialColumn = {name: fields.name, hide: fields.hide};
    switch (newType) {
      case 'text':
      case 'integer':
      case 'boolean':
      case 'asset':
        addOrEditJournalColumn({...partialColumn, type: newType});
        break;
      case 'date':
        addOrEditJournalColumn({
          ...partialColumn,
          type: newType,
          showTime: fields.showTime,
        });
        break;
      case 'decimal':
        // Default description is 'base' if the date format field is invalid
        addOrEditJournalColumn({
          ...partialColumn,
          type: newType,
          precision: fields.precision,
          // Description cannot change if it is a core column
          description: (column !== undefined && isDecimalColumn(column)) ?
            column.description :
            (isDecimalColumnDescription(fields.decimalColumnDescription) ? fields.decimalColumnDescription : 'base'),
        });
        break;
      default:
        console.warn(`handleSubmit: Unreachable code: newType (${newType}) should be exhausted.`);
    }
    onDialogClose?.();
  };

  const addOrEditJournalColumn = (newColumn: JournalColumn) => {
    if (column && role !== null && role !== undefined) {
      dispatch(editJournalColumn({index: index, role: role, column: newColumn}));
    } else {
      if (isExtraColumn(newColumn)) {
        dispatch(addJournalColumn({index: index, column: newColumn}));
      } else {
        console.warn(`addOrEditJournalColumn: Tried to add a new column that is not an ExtraColumn:\n${JSON.stringify(newColumn, undefined, 2)}.`);
      }
    }
  };

  return (
    <AddEditDialog
      objectName={'Journal Column'}
      edit={Boolean(column)}
      open={open}
      onClose={onDialogClose}
      onEnter={handleReset}
      onReset={handleReset}
      onSubmit={handleSubmit}
      contentMaxWidth="32rem"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Role"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={journalColumnRoleDisplay(role ?? journal?.columns.extra.length ?? 0)}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Column Name"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={fields.name}
            onChange={(e) => setFields(s => ({...s, name: e.target.value}))}
          />
        </Grid>
        <Grid item xs={8}>
          <TextField
            select
            label="Type"
            fullWidth
            variant="outlined"
            size="small"
            required
            disabled={typeof role === 'string'}
            value={fields.type}
            onChange={(e) => setFields(s => ({...s, type: e.target.value}))}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="decimal">Decimal</MenuItem>
            <MenuItem value="integer">Integer</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
            {typeof role === 'string' && [
              <MenuItem value="date" key="date">Date</MenuItem>,
              <MenuItem value="asset" key="asset">Asset</MenuItem>,
            ]}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={<Checkbox />}
            checked={fields.hide}
            onChange={(e, checked) => setFields(s => ({...s, hide: checked}))}
            label="Hide"
            labelPlacement="end"
          />
        </Grid>
        {fields.type === 'date' && (
          <Grid item xs={12}>
            <Box marginLeft="auto" marginRight="auto" width="fit-content">
              <FormControlLabel
                control={<Checkbox />}
                checked={fields.showTime}
                onChange={(e, checked) => setFields(s => ({...s, showTime: checked}))}
                label="Show Time"
                labelPlacement="end"
              />
            </Box>
          </Grid>
        )}
        {fields.type === 'decimal' && (
          <DecimalColumnSettings
            price={fields.decimalColumnDescription === 'price'}
            disableDescription={typeof role === 'string'}
            description={fields.decimalColumnDescription}
            onDescriptionChange={newDescription => setFields(s => ({...s, decimalColumnDescription: newDescription}))}
            precision={fields.precision}
            onPrecisionChange={newPrecision => setFields(s => ({...s, precision: newPrecision}))}
            newPrecisionFields={newPrecisionFields}
            onNewPrecisionFieldsChange={newFields => setNewPrecisionFields(newFields)}
            onNewPrecisionFieldsReset={handleResetNewPrecisionFields}
            assets={allAssets}
          />
        )}
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditJournalColumnDialog;