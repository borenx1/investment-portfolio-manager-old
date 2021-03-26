import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddEditDialog from '../../components/AddEditDialog';
import { editJournalColumnOrder, selectActiveAccountJournals } from './accountsSlice';

/**
 * Edit journal column order dialog React function component.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - journalIndex: The index of the journal of the column order to edit.
 */
function EditJournalColumnOrderDialog(props) {
  const { journalIndex, onDialogClose, open } = props;
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // The actual column order in the global state
  const columnOrder = journalIndex >= 0 ? journals[journalIndex].columnOrder : [];
  // The edit column order in the dialog. Confirmed when the "edit" button is clicked.
  const [dialogColumnOrder, setDialogColumnOrder] = useState([]);

  const handleReset = () => {
    setDialogColumnOrder(columnOrder);
  };

  const handleReorderColumn = (index, newIndex) => {
    const newColumnOrder = [...dialogColumnOrder];
    newColumnOrder.splice(newIndex, 0, newColumnOrder.splice(index, 1)[0]);
    setDialogColumnOrder(newColumnOrder);
  };

  const handleSubmit = () => {
    dispatch(editJournalColumnOrder({journalIndex: journalIndex, columnOrder: dialogColumnOrder}));
    onDialogClose();
  };

  return (
    <AddEditDialog
      objectName={'Column Order'}
      edit={true}
      open={open}
      onClose={onDialogClose}
      onEnter={handleReset}
      onReset={handleReset}
      onSubmit={handleSubmit}
    >
      <List>
        {dialogColumnOrder.map((c, i) =>
          <ListItem dense disableGutters divider key={c}>
            <ListItemIcon>
              <IconButton disabled={i === 0} onClick={() => handleReorderColumn(i, i - 1)}>
                <ArrowUpwardIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary={c} />
            <ListItemSecondaryAction>
              <IconButton edge="end" disabled={i === dialogColumnOrder.length - 1} onClick={() => handleReorderColumn(i, i + 1)}>
                <ArrowDownwardIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </AddEditDialog>
  );
}

export default EditJournalColumnOrderDialog;