import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import AddEditDialog from '../../components/AddEditDialog';
import { addJournalColumn, editJournalColumn, selectActiveAccountJournals } from './accountsSlice';

/**
 * React component. Add or change journal column dialog.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - journalIndex: The index of the journal selected.
 * - columnRole: The role column of the selected journal to edit. Set to falsy value to add a new column.
 */
function AddEditJournalColumnDialog(props) {
  const { open, onDialogClose, journalIndex, columnRole } = props;
  const [fields, setFields] = useState({
    role: '',
    name: '',
    type: '',
    hide: false,
    precision: '',
    dateTimeFormat: '',
  });
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // journalIndex is set to -1 initially
  const journal = journalIndex >= 0 ? journals[journalIndex] : null;

  const handleReset = () => {
    setFields({
      role: columnRole || `extra-${journal.columns.extra.length}`,
      name: '',
      type: 'text',
      hide: false,
      precision: '',
      dateTimeFormat: 'date',
    });
  };

  const handleDialogOpen = () => {
    if (columnRole) {
      // Get the column with the given role. If it is an extra column, the column exists in journal.columns.extra[index].
      const column = columnRole.slice(0, 5) === 'extra' ?
                     journal.columns.extra[parseInt(columnRole.split('-')[1])] :
                     journal.columns[columnRole];
      setFields({
        role: columnRole,
        name: column.name,
        type: column.type,
        hide: column.hide,
        precision: column.precision,
        dateTimeFormat: column.dateTimeFormat,
      });
    } else {
      handleReset();
    }
  };

  const handleSubmit = () => {
    const  {role, ...column } = fields;
    if (columnRole) {
      dispatch(editJournalColumn({journalIndex: journalIndex, columnRole: columnRole, column: column}));
    } else {
      dispatch(addJournalColumn({journalIndex: journalIndex, column: column}));
    }
    onDialogClose();
  };

  return (
    <AddEditDialog
      objectName={'Journal Column'}
      edit={Boolean(columnRole)}
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
            onChange={(e) => setFields(s => ({...s, type: e.target.value}))}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="decimal">Decimal</MenuItem>
            <MenuItem value="integer">Integer</MenuItem>
            <MenuItem value="date">Date</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={<Checkbox />}
            checked={fields.hide}
            onChange={(e) => setFields(s => ({...s, hide: e.target.checked}))}
            label="Hide"
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
            required={fields.type === 'decimal'}
            disabled={fields.type !== 'decimal'}
            value={fields.precision}
            onChange={(e) => setFields(s => ({...s, precision: e.target.value}))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            select
            label="Date Time Format"
            fullWidth
            variant="outlined"
            size="small"
            required={fields.type === 'date'}
            disabled={fields.type !== 'date'}
            value={fields.dateTimeFormat}
            onChange={(e) => setFields(s => ({...s, dateTimeFormat: e.target.value}))}
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