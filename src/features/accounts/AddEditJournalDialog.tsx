import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Box from '@material-ui/core/Box';
import AddEditDialog from '../../components/AddEditDialog';
import { addDefaultJournal, editJournalSettings, selectActiveAccountJournals } from './accountsSlice';
import { Journal, JournalType } from '../../models/Account';

interface FormFields {
  name: string,
  type: JournalType,
}

const initialFormFields: FormFields = {
  name: '',
  type: 'trading',
};

interface Props {
  open: boolean;
  onDialogClose?: React.MouseEventHandler<HTMLButtonElement>;
  index: number;
}

/**
 * React component. Add or change journal column dialog.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - index: The index of the journal selected to edit. Set to index out of range (use a negative number) to add new journal.
 */
function AddEditJournalDialog(props: Readonly<Props>) {
  const { open, onDialogClose, index } = props;
  const [fields, setFields] = useState<FormFields>(initialFormFields);
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // journalIndex is set to -1 initially
  const journal: Journal | undefined = journals[index];

  const handleReset = () => {
    setFields(initialFormFields);
  };

  const handleDialogOpen = () => {
    if (journal) {
      // Edit mode
      setFields({
        name: journal.name,
        type: journal.type,
      });
    } else {
      handleReset();
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (journal) {
      dispatch(editJournalSettings({index: index, name: fields.name, type: fields.type}));
    } else {
      dispatch(addDefaultJournal({name: fields.name, type: fields.type}));
    }
    onDialogClose?.(e);
  };

  return (
    <AddEditDialog
      objectName={'Journal'}
      edit={Boolean(journal)}
      open={open}
      onClose={onDialogClose}
      onEnter={handleDialogOpen}
      onReset={handleReset}
      onSubmit={e => handleSubmit(e)}
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
          onChange={(e) => setFields(s => ({...s, type: e.target.value as JournalType}))}
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