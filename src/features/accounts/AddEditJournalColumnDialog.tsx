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
  TextColumn,
  IntegerColumn,
  DecimalColumn,
  BooleanColumn,
  ExtraColumn,
  DateTimeFormat,
  DecimalColumnDescription,
  JournalColumnRole,
  JournalColumnType,
} from '../../models/Account';

interface FormFields {
  role: JournalColumnRole;
  name: string;
  type: JournalColumnType;
  hide: boolean;
  precision: Record<string, number>;
  decimalColumnDescription: DecimalColumnDescription;
  dateFormat: DateTimeFormat,
}

const initialFormFields: FormFields = {
  role: 0,
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
  const [fields, setFields] = useState<FormFields>(initialFormFields);
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // journalIndex is set to -1 initially
  const journal = journals[index] as Journal | undefined;
  // column is the selected column if the props index and role are valid, else undefined
  const column = typeof role === 'string' ? journal?.columns[role] : journal?.columns.extra[role ?? -1];

  const handleReset = () => {
    setFields({...initialFormFields, role: role ?? (journal ? journal.columns.extra.length : 0)});
  };

  const handleDialogOpen = () => {
    if (column) {
      setFields({
        role: role!,
        name: column.name,
        type: column.type,
        hide: column.hide,
        precision: column.type === 'decimal' ? column.precision : initialFormFields.precision,
        decimalColumnDescription: column.type === 'decimal' ? column.description : initialFormFields.decimalColumnDescription,
        dateFormat: column.type === 'date' ? column.format : initialFormFields.dateFormat,
      });
    } else {
      handleReset();
    }
  };

  const handleSubmit = () => {
    if (column) {
      // TODO
      // dispatch(editJournalColumn({journalIndex: journalIndex, columnRole: columnRole, column: column}));
    } else {
      let newColumn: ExtraColumn;
      switch (fields.type) {
        case 'integer':
          newColumn = {name: fields.name, hide: fields.hide, type: fields.type} as IntegerColumn;
          break;
        case 'boolean':
          newColumn = {name: fields.name, hide: fields.hide, type: fields.type} as BooleanColumn;
          break;
        case 'decimal':
          newColumn = {
            name: fields.name,
            hide: fields.hide,
            type: fields.type,
            precision: fields.precision,
            description: fields.decimalColumnDescription,
          } as DecimalColumn;
          break;
        // Default column is text column
        case 'text':
        default:
          if (fields.type !== 'text') console.warn(`AddEditJournalColumnDialog: Add journal column with type: ${fields.type}.`);
          newColumn = {name: fields.name, hide: fields.hide, type: fields.type} as TextColumn;
      }
      dispatch(addJournalColumn({index: index, column: newColumn}));
    }
    onDialogClose?.();
  };

  return (
    <AddEditDialog
      objectName={'Journal Column'}
      edit={Boolean(column)}
      open={open}
      onClose={onDialogClose}
      onEnter={handleDialogOpen}
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
            value={fields.role}
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
            value={fields.type}
            onChange={(e) => setFields(s => ({...s, type: e.target.value as JournalColumnType}))}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="decimal">Decimal</MenuItem>
            <MenuItem value="integer">Integer</MenuItem>
            <MenuItem value="boolean">Boolean</MenuItem>
            {typeof role === 'string' &&
              <React.Fragment>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="asset">Asset</MenuItem>
              </React.Fragment>
            }
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
          {/* TODO: display precision better */}
          <TextField
            type="number"
            label="Precision"
            fullWidth
            variant="outlined"
            size="small"
            required={fields.type === 'decimal'}
            disabled={fields.type !== 'decimal'}
            value={String(fields.precision)}
            // onChange={(e) => setFields(s => ({...s, precision: e.target.value}))}
          />
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
            onChange={(e) => setFields(s => ({...s, dateFormat: e.target.value as DateTimeFormat}))}
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