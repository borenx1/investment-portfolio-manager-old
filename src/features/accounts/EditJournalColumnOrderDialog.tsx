import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles, Theme } from '@material-ui/core/styles'; 
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from '@material-ui/core/Tooltip';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddEditDialog from '../../components/AddEditDialog';
import { editJournalColumn, editJournalColumnOrder, selectActiveAccountJournals } from './accountsSlice';
import { getJournalColumn, JournalColumnRole, journalColumnRoleDisplay } from '../../models/account';

interface Props {
  open: boolean;
  onDialogClose?: () => void;
  journal: number;
  displayRoleDefault?: boolean;
  editHide?: boolean;
}

const useStyles = makeStyles<Theme, Props>((theme) => ({
  listItem: {
    paddingRight: props => props.editHide ? 100 : 50,
  },
}));

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
  const classes = useStyles(props);
  const { journal: journalIndex, onDialogClose, open, displayRoleDefault, editHide } = props;
  const dispatch = useDispatch();
  const journal = useSelector(selectActiveAccountJournals)[journalIndex];
  // The actual column order in the global state
  const columnOrder = journal?.columnOrder ?? [];
  // The edit column order in the dialog. Confirmed when the "edit" button is clicked.
  const [dialogColumnOrder, setDialogColumnOrder] = useState<JournalColumnRole[]>(columnOrder);
  const [hiddenColumns, setHiddenColumns] = useState<JournalColumnRole[]>([]);
  const [displayRole, setDisplayRole] = useState(displayRoleDefault ?? false);

  const handleReset = () => {
    setDialogColumnOrder(columnOrder);
    if (journal !== undefined) {
      const newHiddenColumns: JournalColumnRole[] = [];
      columnOrder.forEach((role) => {
        if (getJournalColumn(journal, role).hide) {
          newHiddenColumns.push(role);
        }
      });
      setHiddenColumns(newHiddenColumns);
    } else {
      setHiddenColumns([]);
    }
  };

  const handleReorderColumn = (index: number, newIndex: number) => {
    if (dialogColumnOrder[index] !== undefined) {
      const newColumnOrder = [...dialogColumnOrder];
      newColumnOrder.splice(newIndex, 0, newColumnOrder.splice(index, 1)[0]!);
      setDialogColumnOrder(newColumnOrder);
    }
  };

  const handleToggleHide = (role: JournalColumnRole) => {
    const newHiddenColumns = [...hiddenColumns];
    const hiddenIndex = hiddenColumns.indexOf(role);
    if (hiddenIndex === -1) {
      newHiddenColumns.push(role);
    } else {
      newHiddenColumns.splice(hiddenIndex, 1);
    }
    setHiddenColumns(newHiddenColumns);
  }

  const handleSubmit = () => {
    if (journal !== undefined) {
      dispatch(editJournalColumnOrder({index: journalIndex, columnOrder: dialogColumnOrder}));
      if (editHide) {
        dialogColumnOrder.forEach(role => {
          const oldColumn = getJournalColumn(journal, role);
          const newHide = hiddenColumns.indexOf(role) !== -1;
          dispatch(editJournalColumn({index: journalIndex, role: role, column: {...oldColumn, hide: newHide}}));
        });
      }
    }
    onDialogClose?.();
  };

  return (
    <AddEditDialog
      objectName={'Columns Layout'}
      edit
      open={open}
      onClose={onDialogClose}
      onEnter={handleReset}
      onReset={handleReset}
      onSubmit={handleSubmit}
    >
      <FormControlLabel
        control={<Switch />}
        checked={displayRole}
        onChange={(e, checked) => setDisplayRole(checked)}
        label={displayRole ? 'Role' : 'Name'}
        labelPlacement="end"
      />
      <List>
        {dialogColumnOrder.map((role, i) =>
          <ListItem dense disableGutters divider classes={{secondaryAction: classes.listItem}} key={role}>
            <ListItemIcon>
              <Tooltip title="Reorder column up">
                <IconButton
                  disableRipple
                  disabled={i === 0}
                  onClick={() => handleReorderColumn(i, i - 1)}
                  aria-label="Reorder column up"
                >
                  <ArrowUpwardIcon />
                </IconButton>
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary={displayRole ? journalColumnRoleDisplay(role) : getJournalColumn(journal!, role).name} />
            <ListItemSecondaryAction>
              {editHide && <Tooltip title="Show column">
                <Checkbox
                  checked={hiddenColumns.indexOf(role) === -1}
                  onChange={() => handleToggleHide(role)}
                />
              </Tooltip>}
              <Tooltip title="Reorder column down">
                <IconButton
                  edge="end"
                  disableRipple
                  disabled={i === dialogColumnOrder.length - 1}
                  onClick={() => handleReorderColumn(i, i + 1)}
                  aria-label="Reorder column down"
                >
                  <ArrowDownwardIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        )}
      </List>
    </AddEditDialog>
  );
}

export default EditJournalColumnOrderDialog;