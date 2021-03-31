import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import AddEditDialog from '../../components/AddEditDialog';
import { addJournalColumn, editJournalColumn, selectActiveAccountJournals } from './accountsSlice';
import {
  Journal,
  JournalColumn,
  JournalColumnRole,
  JournalColumnType,
  isDateColumnFormat,
  isExtraColumn,
  isDecimalColumnDescription,
  isJournalColumnType,
} from '../../models/account';
import { journalColumnRoleDisplay } from '../../models/accountFunctions';

interface FormFields {
  name: string;
  type: string;
  hide: boolean;
  precision: Record<string, number>;
  decimalColumnDescription: string;
  dateFormat: string,
}

const initialFormFields: Readonly<FormFields> = {
  name: '',
  type: 'text',
  hide: false,
  precision: {},
  decimalColumnDescription: 'base',
  dateFormat: 'date',
};

interface Props {
  open: boolean;
  onDialogClose?: () => void;
  index: number;
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
  const { open, onDialogClose, index, role } = props;
  const [fields, setFields] = useState<Readonly<FormFields>>(initialFormFields);
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // journalIndex is set to -1 initially
  const journal = journals[index] as Journal | undefined;
  // column is the selected column if the props index and role are valid, else undefined
  const column = typeof role === 'string' ? journal?.columns[role] : journal?.columns.extra[role ?? -1];

  const handleReset = () => { 
    if (column) {
      setFields({
        name: column.name,
        type: column.type,
        hide: column.hide,
        precision: column.type === 'decimal' ? column.precision : initialFormFields.precision,
        decimalColumnDescription: column.type === 'decimal' ? column.description : initialFormFields.decimalColumnDescription,
        dateFormat: column.type === 'date' ? column.format : initialFormFields.dateFormat,
      });
    } else {
      setFields(initialFormFields);
    }
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
        // Default format is 'date' if the date format field is invalid
        addOrEditJournalColumn({
          ...partialColumn,
          type: newType,
          format: isDateColumnFormat(fields.dateFormat) ? fields.dateFormat : 'date',
        });
        break;
      case 'decimal':
        // Default description is 'base' if the date format field is invalid
        addOrEditJournalColumn({
          ...partialColumn,
          type: newType,
          precision: fields.precision,
          description: isDecimalColumnDescription(fields.decimalColumnDescription) ? fields.decimalColumnDescription : 'base',
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

  // TODO: edit precision for decimal columns
  return (
    <AddEditDialog
      objectName={'Journal Column'}
      edit={Boolean(column)}
      open={open}
      onClose={onDialogClose}
      onEnter={handleReset}
      onReset={handleReset}
      onSubmit={handleSubmit}
      contentMaxWidth="30rem"
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
        <Grid item xs={6}>
          <TextField
            select
            label="Description (Decimal)"
            fullWidth
            variant="outlined"
            size="small"
            required={fields.type === 'decimal'}
            disabled={fields.type !== 'decimal'}
            value={fields.decimalColumnDescription}
            onChange={(e) => setFields(s => ({...s, decimalColumnDescription: e.target.value}))}
          >
            <MenuItem value="base">Base</MenuItem>
            <MenuItem value="quote">Quote</MenuItem>
            <MenuItem value="price">Price</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="Date Format"
            fullWidth
            variant="outlined"
            size="small"
            required={fields.type === 'date'}
            disabled={fields.type !== 'date'}
            value={fields.dateFormat}
            onChange={(e) => setFields(s => ({...s, dateFormat: e.target.value}))}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="datetime">Date & Time</MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </AddEditDialog>
  );
}

export default AddEditJournalColumnDialog;