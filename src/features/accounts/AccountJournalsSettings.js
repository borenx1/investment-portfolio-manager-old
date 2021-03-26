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
import AddEditJournalColumnDialog from './AddEditJournalColumnDialog';
import EditJournalColumnOrderDialog from './EditJournalColumnOrderDialog';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import { selectActiveAccount } from './accountsSlice';

const useJournalColumnRowStyles = makeStyles(theme => ({
  root: {
    cursor: 'pointer',
  },
}));

function JournalColumnRow(props) {
  const classes = useJournalColumnRowStyles();
  const { role, journalColumn, onClick } = props;
  return (
    <TableRow hover onClick={onClick} className={classes.root}>
      <TableCell>{ role }</TableCell>
      <TableCell>{ journalColumn.name }</TableCell>
      <TableCell>{ journalColumn.type }</TableCell>
      <TableCell>{ journalColumn.type === 'decimal' && journalColumn.precision }</TableCell>
      <TableCell>{ journalColumn.type === 'date' && journalColumn.dateTimeFormat }</TableCell>
      <TableCell>{ journalColumn.hide ? 'Yes' : 'No' }</TableCell>
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
 * - onEditJournal: Callback when requested to edit the Journal.
 * - onAddColumn: Callback when requested to add a new column.
 * - onEditColumn: Callback when requested to edit a column. Signature is (role).
 * - onEditColumnOrder: Callback when requested to edit the column order.
 */
function JournalRow(props) {
  const classes = useJournalRowStyles();
  const { journal, index, onEditJournal, onAddColumn, onEditColumn, onEditColumnOrder } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow hover className={classes.mainRow}>
        <TableCell>{journal.name}</TableCell>
        <TableCell align="center">{journal.type}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} className={classes.collapsibleCell}>
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
                    <TableCell>Precision</TableCell>
                    <TableCell>Date Format</TableCell>
                    <TableCell>Hide</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* pair = [role, column] */}
                  {Object.entries(journal.columns).map(pair =>
                    pair[0] !== 'extra' && <JournalColumnRow
                      role={pair[0]}
                      journalColumn={pair[1]}
                      onClick={() => onEditColumn(pair[0])}
                      key={pair[0]}
                    />
                  )}
                  {journal.columns.extra.map((col, i) =>
                    <JournalColumnRow
                      role={`extra-${i}`}
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
                    <Chip label={c} className={classes.columnOrderChip} />
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
  const [addEditJournalColumnDialogOpen, setAddEditJournalColumnDialogOpen] = useState(false);
  const [editJournalColumnOrderDialogOpen, setEditJournalColumnOrderDialogOpen] = useState(false);
  // Index of the Journal to edit when editing a journal setting. Set to -1 to add new journal.
  const [selectedJournal, setSelectedJournal] = useState(-1);
  // The "role" of the Journal Column to edit. Set to null to add new journal column.
  const [selectedJournalColumn, setSelectedJournalColumn] = useState(null);
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const journals = account.journals;

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
        <Typography variant="h6" gutterBottom>Journals</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Columns</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {journals.map((j, i) =>
                <JournalRow
                  journal={j}
                  index={i}
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