import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import AddIcon from '@material-ui/icons/Add';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddEditJournalDialog from './AddEditJournalDialog';
import AddEditJournalColumnDialog from './AddEditJournalColumnDialog';
import EditJournalColumnOrderDialog from './EditJournalColumnOrderDialog';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import DeleteButton from '../../components/DeleteButton';
import { deleteJournal, selectActiveAccountJournals } from './accountsSlice';
import { Journal, JournalColumnRole } from '../../models/account';
import AccountJournalColumnSettings from './AccountJournalColumnSettings';

interface JournalRowProps {
  index: number;
  journal: Journal;
  onClick?: React.MouseEventHandler<HTMLTableRowElement>;
  onAddColumn?: (journal: number) => void;
  onEditColumn?: (journal: number, role: JournalColumnRole) => void;
  onEditColumnOrder?: (journal: number) => void;
}

const useJournalRowStyles = makeStyles<Theme, JournalRowProps>(theme => ({
  mainRow: {
    cursor: props => props.onClick ? 'pointer' : undefined,
    '& > *': {                // select all children
      borderBottom: 'none',   // remove the bottom border of the TableCell children
    },
  },
  collapsibleCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

/**
 * React component.
 * 
 * Props:
 * - journal: The journal object of the row.
 * - index: The index of the journal in the account.
 * - onAddColumn: Callback when requested to add a new column.
 * - onEditColumn: Callback when requested to edit a column. Signature is (role).
 * - onEditColumnOrder: Callback when requested to edit the column order.
 * - onClick: Callback when the row is clicked.
 */
function JournalRow(props: JournalRowProps) {
  const classes = useJournalRowStyles(props);
  const { journal, index, onAddColumn, onEditColumn, onEditColumnOrder, onClick } = props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const expandRow = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setOpen(s => !s);
    e.stopPropagation();
  };

  const handleDeleteJournal = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dispatch(deleteJournal({index: index}));
    e.stopPropagation();
  }

  return (
    <React.Fragment>
      <TableRow hover onClick={onClick} className={classes.mainRow}>
        <TableCell>{journal.name}</TableCell>
        <TableCell align="center">{journal.type}</TableCell>
        <TableCell align="center" size="small">
          <IconButton aria-label="Expand row" onClick={expandRow}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" size="small">
          <DeleteButton onClick={handleDeleteJournal} />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className={classes.collapsibleCell}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <AccountJournalColumnSettings
                index={index}
                journal={journal}
                onAddColumn={onAddColumn}
                onEditColumn={onEditColumn}
                onEditColumnOrder={onEditColumnOrder}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

/**
 * See https://material-ui.com/components/tables/#collapsible-table.
 */
function AccountJournalsSettings() {
  const [addEditJournalDialogOpen, setAddEditJournalDialogOpen] = useState(false);
  const [addEditJournalColumnDialogOpen, setAddEditJournalColumnDialogOpen] = useState(false);
  const [editJournalColumnOrderDialogOpen, setEditJournalColumnOrderDialogOpen] = useState(false);
  // Index of the Journal to edit when editing a journal setting. Set to -1 to add new journal.
  const [selectedJournal, setSelectedJournal] = useState(-1);
  // The "role" of the Journal Column to edit. Set to null to add new journal column.
  const [selectedJournalColumn, setSelectedJournalColumn] = useState<JournalColumnRole | null>(null);
  const journals = useSelector(selectActiveAccountJournals);

  const openAddJournalDialog = () => {
    setSelectedJournal(-1);
    setAddEditJournalDialogOpen(true);
  };

  const openEditJournalDialog = (index: number) => {
    setSelectedJournal(index);
    setAddEditJournalDialogOpen(true);
  };

  const openAddColumnDialog = (index: number) => {
    setSelectedJournal(index);
    setSelectedJournalColumn(null);
    setAddEditJournalColumnDialogOpen(true);
  };

  const openEditColumnDialog = (index: number, role: JournalColumnRole) => {
    setSelectedJournal(index);
    setSelectedJournalColumn(role);
    setAddEditJournalColumnDialogOpen(true);
  };

  const openEditColumnOrderDialog = (index: number) => {
    setSelectedJournal(index);
    setEditJournalColumnOrderDialogOpen(true);
  };

  return (
    <React.Fragment>
      <SettingsSection>
        <IconButtonHeading
          variant="h6"
          title="Journals"
          icon={<AddIcon fontSize="small" />}
          onClick={openAddJournalDialog}
        />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Columns</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {journals.map((j, i) =>
                <JournalRow
                  journal={j}
                  index={i}
                  onClick={() => openEditJournalDialog(i)}
                  onAddColumn={(_) => openAddColumnDialog(i)}
                  onEditColumn={(_, role) => openEditColumnDialog(i, role)}
                  onEditColumnOrder={(_) => openEditColumnOrderDialog(i)}
                  key={i}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </SettingsSection>
      <AddEditJournalDialog
        open={addEditJournalDialogOpen}
        onDialogClose={() => setAddEditJournalDialogOpen(false)}
        journal={selectedJournal}
      />
      <AddEditJournalColumnDialog
        open={addEditJournalColumnDialogOpen}
        onDialogClose={() => setAddEditJournalColumnDialogOpen(false)}
        journal={selectedJournal}
        role={selectedJournalColumn}
      />
      <EditJournalColumnOrderDialog
        open={editJournalColumnOrderDialogOpen}
        onDialogClose={() => setEditJournalColumnOrderDialogOpen(false)}
        journal={selectedJournal}
        displayRoleDefault
      />
    </React.Fragment>
  );
}

export default AccountJournalsSettings;