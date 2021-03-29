import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import AddEditDialog from '../../components/AddEditDialog';
import { addJournal, editJournalSettings, selectActiveAccountJournals } from './accountsSlice';

/**
 * React component. Add or change journal column dialog.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - journalIndex: The index of the journal selected.
 */
function AddEditJournalDialog(props) {
  const { open, onDialogClose, journalIndex } = props;
  const [fields, setFields] = useState({
    name: '',
    type: '',
  });
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // journalIndex is set to -1 initially
  const journal = journalIndex >= 0 ? journals[journalIndex] : null;

  const handleReset = () => {
    setFields({
      name: '',
      type: 'trading',
    });
  };

  const handleDialogOpen = () => {
    if (journalIndex >= 0) {
      // Edit mode
      setFields({
        name: journal.name,
        type: journal.type,
      });
    } else {
      handleReset();
    }
  };

  const handleSubmit = () => {
    if (journalIndex >= 0) {
      dispatch(editJournalSettings({index: journalIndex, name: fields.name, type: fields.type}));
    } else {
      dispatch(addJournal({journal: {...fields}}));
    }
    onDialogClose();
  };

  return (
    <AddEditDialog
      objectName={'Journal'}
      edit={journalIndex >= 0}
      open={open}
      onClose={onDialogClose}
      onEnter={handleDialogOpen}
      onReset={handleReset}
      onSubmit={handleSubmit}
    >
      <Box>
        <TextField
          type="text"
          label="Journal Name"
          fullWidth
          variant="outlined"
          size="small"
          required
          value={fields.name}
          onChange={(e) => setFields(s => ({...s, name: e.target.value}))}
        />
      </Box>
      <Box mt={2}>
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
          <MenuItem value="trading">Trading</MenuItem>
          <MenuItem value="income">Income</MenuItem>
          <MenuItem value="expense">Expense</MenuItem>
        </TextField>
      </Box>
    </AddEditDialog>
  );
}

export default AddEditJournalDialog;