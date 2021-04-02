import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from "@material-ui/core/IconButton";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddEditDialog from '../../components/AddEditDialog';
import { editJournalColumnOrder, selectActiveAccountJournals } from './accountsSlice';
import { Journal, JournalColumnRole, journalColumnRoleDisplay } from '../../models/account';

interface Props {
  open: boolean;
  onDialogClose?: () => void;
  journal: number;
  displayRoleDefault?: boolean;
}

/**
 * Edit journal column order dialog React function component.
 * 
 * Props:
 * - open: Dialog shows if true.
 * - onDialogClose: Function called when the dialog requests to be closed.
 * - journal: The index of the journal of the column order to edit.
 * - displayRoleDefault: Use the column role as the identifier instead of the column name as the default. Default false.
 */
function EditJournalColumnOrderDialog(props: Readonly<Props>) {
  const { journal: index, onDialogClose, open, displayRoleDefault } = props;
  const dispatch = useDispatch();
  const journals = useSelector(selectActiveAccountJournals);
  const journal = journals[index] as Journal | undefined;
  // The actual column order in the global state
  const columnOrder = journal?.columnOrder ?? [];
  // The edit column order in the dialog. Confirmed when the "edit" button is clicked.
  const [dialogColumnOrder, setDialogColumnOrder] = useState<JournalColumnRole[]>(columnOrder);
  const [displayRole, setDisplayRole] = useState(displayRoleDefault ?? false);

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
      <FormControlLabel
        control={<Switch />}
        checked={displayRole}
        onChange={() => setDisplayRole(s => !s)}
        label={displayRole ? 'Role' : 'Name'}
        labelPlacement="end"
      />
      <List>
        {dialogColumnOrder.map((role, i) =>
          <ListItem dense disableGutters divider key={role}>
            <ListItemIcon>
              <IconButton disabled={i === 0} onClick={() => handleReorderColumn(i, i - 1)}>
                <ArrowUpwardIcon />
              </IconButton>
            </ListItemIcon>
            <ListItemText primary={displayRole ? journalColumnRoleDisplay(role) : (typeof role === 'string' ? journal!.columns[role].name : journal!.columns.extra[role].name)} />
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