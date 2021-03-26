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
import EditJournalColumnOrderDialog from './EditJournalColumnOrderDialog';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import { selectActiveAccount } from './accountsSlice';

function JournalColumnRow(props) {
  const { role, journalColumn } = props;
  return (
    <TableRow>
      <TableCell>{ role }</TableCell>
      <TableCell>{ journalColumn.name }</TableCell>
      <TableCell>{ journalColumn.type }</TableCell>
      <TableCell>{ journalColumn.type === 'number' && journalColumn.precision }</TableCell>
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
 * - onAddColumn: Callback when requested to add a new column
 * - onEditColumn: Callback when requested to edit a column.
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
                  {Object.entries(journal.columns).map(pair => 
                    pair[0] !== 'extra' && <JournalColumnRow role={pair[0]} journalColumn={pair[1]} key={pair[0]} />
                  )}
                  {journal.columns.extra.map((col, i) =>
                    <JournalColumnRow role={'extra'} journalColumn={col} key={i} />
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
  const [editJournalColumnOrderDialogOpen, setEditJournalColumnOrderDialogOpen] = useState(false);
  // Index of the Journal to edit when editing a journal setting. Set to -1 to add new journal.
  const [selectedJournal, setSelectedJournal] = useState(-1);
  // const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const journals = account.journals;

  const openEditColumnOrderDialog = (index) => () => {
    setSelectedJournal(index);
    setEditJournalColumnOrderDialogOpen(true);
  };

  // const handleAddEditAsset = () => {
  //   if (selectedAsset < 0) {
  //     // Add
  //     dispatch(addAsset({asset: {...addEditAssetFields}}));
  //   } else {
  //     // Edit
  //     dispatch(editAsset({asset: {...addEditAssetFields}, index: selectedAsset}));
  //   }
  //   setAddEditAssetDialogOpen(false);
  // };

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
                  onEditColumnOrder={openEditColumnOrderDialog(i)}
                  key={i}
                />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddAssetDialog}
        >
            Add New Asset
        </Button> */}
      </SettingsSection>
      <EditJournalColumnOrderDialog
        open={editJournalColumnOrderDialogOpen}
        onDialogClose={() => setEditJournalColumnOrderDialogOpen(false)}
        journalIndex={selectedJournal}
      />
    </React.Fragment>
  );
}

export default AccountJournalsSettings;