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
import { JournalColumnRole } from '../../models/Account';

interface Props {
  open: boolean;
  onDialogClose?: () => void;
  index: number;
}

/**
 * Edit journal column order dialog React function component.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - index: The index of the journal of the column order to edit.
 */
function EditJournalColumnOrderDialog(props: Readonly<Props>) {
  const { index, onDialogClose, open } = props;
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  // The actual column order in the global state
  const columnOrder = journals[index]?.columnOrder ?? [];
  // The edit column order in the dialog. Confirmed when the "edit" button is clicked.
  const [dialogColumnOrder, setDialogColumnOrder] = useState<JournalColumnRole[]>(columnOrder);

  const handleReset = () => {
    setDialogColumnOrder(columnOrder);
  };

  const handleReorderColumn = (index: number, newIndex: number) => {
    const newColumnOrder = [...dialogColumnOrder];
    newColumnOrder.splice(newIndex, 0, newColumnOrder.splice(index, 1)[0]);
    setDialogColumnOrder(newColumnOrder);
  };

  const handleSubmit = () => {
    dispatch(editJournalColumnOrder({index: index, columnOrder: dialogColumnOrder}));
    onDialogClose?.();
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
        {dialogColumnOrder.map((role, i) =>
          <ListItem dense disableGutters divider key={role}>
            <ListItemIcon>
              <IconButton disabled={i === 0} onClick={() => handleReorderColumn(i, i - 1)}>
                <ArrowUpwardIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary={role} />
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