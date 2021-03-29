import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddEditJournalDialog from './AddEditJournalDialog';
import AddEditJournalColumnDialog from './AddEditJournalColumnDialog';
import EditJournalColumnOrderDialog from './EditJournalColumnOrderDialog';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import DeleteButton from '../../components/DeleteButton';
import { deleteJournal, deleteJournalColumn, selectActiveAccount } from './accountsSlice';

const useJournalColumnRowStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
  },
}));

function JournalColumnRow(props) {
  const classes = useJournalColumnRowStyles();
  const { role, journalIndex, journalColumn, onClick } = props;
  const dispatch = useDispatch();

  const handleDeleteColumn = e => {
    if (role.split('-')[0] === 'extra') {
      dispatch(deleteJournalColumn({journalIndex: journalIndex, columnIndex: parseInt(role.split('-')[1])}));
    }
    e.stopPropagation();
  };

  return (
    <TableRow hover onClick={onClick} className={classes.root}>
      <TableCell>{ role }</TableCell>
      <TableCell>{ journalColumn.name }</TableCell>
      <TableCell>{ journalColumn.type }</TableCell>
      {/* TODO: display precision better */}
      <TableCell align="center">{ journalColumn.type === 'decimal' && String(journalColumn.precision) }</TableCell>
      <TableCell align="center">{ journalColumn.type === 'date' && String(journalColumn.format) }</TableCell>
      <TableCell align="center">{ journalColumn.hide ? 'Yes' : 'No' }</TableCell>
      <TableCell align="center">
        <DeleteButton
          buttonSize="small"
          iconSize="small"
          disabled={role.slice(0, 5) !== 'extra'}
          onClick={handleDeleteColumn}
        />
      </TableCell>
    </TableRow>
  );
}

const useJournalRowStyles = makeStyles(theme => ({
  mainRow: {
    cursor: 'pointer',
    '& > *': {    // select all children
      borderBottom: 'none',   // remove the bottom border of the TableCell children
    },
  },
  collapsibleCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  columnOrderChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
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
function JournalRow(props) {
  const classes = useJournalRowStyles();
  const { journal, index, onAddColumn, onEditColumn, onEditColumnOrder, onClick } = props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const expandRow = e => {
    setOpen(s => !s);
    e.stopPropagation();
  };

  const handleDeleteJournal = e => {
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
              <IconButtonHeading
                variant="h6"
                title={'Columns'}
                icon={<AddIcon fontSize="small" />}
                onClick={onAddColumn}
              />
              <Table size="small" aria-label="Journal columns">
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="center">Precision</TableCell>
                    <TableCell align="center">Date Format</TableCell>
                    <TableCell align="center">Hide</TableCell>
                    <TableCell align="center"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* pair = [role, column] */}
                  {Object.entries(journal.columns).map(pair =>
                    pair[0] !== 'extra' && <JournalColumnRow
                      role={pair[0]}
                      journalIndex={index}
                      journalColumn={pair[1]}
                      onClick={() => onEditColumn(pair[0])}
                      key={pair[0]}
                    />
                  )}
                  {journal.columns.extra.map((col, i) =>
                    <JournalColumnRow
                      role={`extra-${i}`}
                      journalIndex={index}
                      journalColumn={col}
                      onClick={() => onEditColumn(`extra-${i}`)}
                      key={i}
                    />
                  )}
                </TableBody>
              </Table>
              <Box mt={1}>
                <IconButtonHeading
                  variant="h6"
                  title={'Column Order'}
                  icon={<EditIcon fontSize="small" />}
                  onClick={onEditColumnOrder}
                />
                <Box display="flex" flexWrap="wrap">
                  {journal.columnOrder.map(c =>
                    <Chip label={c} className={classes.columnOrderChip} key={c} />
                  )}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  tableRow: {
    cursor: 'pointer',
  },
}));

/**
 * See https://material-ui.com/components/tables/#collapsible-table.
 */
function AccountJournalsSettings(props) {
  const classes = useStyles();
  const [addEditJournalDialogOpen, setAddEditJournalDialogOpen] = useState(false);
  const [addEditJournalColumnDialogOpen, setAddEditJournalColumnDialogOpen] = useState(false);
  const [editJournalColumnOrderDialogOpen, setEditJournalColumnOrderDialogOpen] = useState(false);
  // Index of the Journal to edit when editing a journal setting. Set to -1 to add new journal.
  const [selectedJournal, setSelectedJournal] = useState(-1);
  // The "role" of the Journal Column to edit. Set to null to add new journal column.
  const [selectedJournalColumn, setSelectedJournalColumn] = useState(null);
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const journals = account.journals;

  const openAddJournalDialog = () => {
    setSelectedJournal(-1);
    setAddEditJournalDialogOpen(true);
  };

  const openEditJournalDialog = (index) => {
    setSelectedJournal(index);
    setAddEditJournalDialogOpen(true);
  };

  const openAddColumnDialog = (index) => {
    setSelectedJournal(index);
    setSelectedJournalColumn(null);
    setAddEditJournalColumnDialogOpen(true);
  };

  const openEditColumnDialog = (index, role) => {
    setSelectedJournal(index);
    setSelectedJournalColumn(role);
    setAddEditJournalColumnDialogOpen(true);
  };

  const openEditColumnOrderDialog = (index) => {
    setSelectedJournal(index);
    setEditJournalColumnOrderDialogOpen(true);
  };

  return (
    <React.Fragment>
      <SettingsSection>
        <IconButtonHeading
          variant="h6"
          title={'Journals'}
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
                  onAddColumn={() => openAddColumnDialog(i)}
                  onEditColumn={role => openEditColumnDialog(i, role)}
                  onEditColumnOrder={() => openEditColumnOrderDialog(i)}
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
        journalIndex={selectedJournal}
      />
      <AddEditJournalColumnDialog
        open={addEditJournalColumnDialogOpen}
        onDialogClose={() => setAddEditJournalColumnDialogOpen(false)}
        journalIndex={selectedJournal}
        columnRole={selectedJournalColumn}
      />
      <EditJournalColumnOrderDialog
        open={editJournalColumnOrderDialogOpen}
        onDialogClose={() => setEditJournalColumnOrderDialogOpen(false)}
        journalIndex={selectedJournal}
      />
    </React.Fragment>
  );
}

export default AccountJournalsSettings;