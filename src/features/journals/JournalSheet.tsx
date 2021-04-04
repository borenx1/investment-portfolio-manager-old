
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddEditTransactionDialog from './AddEditTransactionDialog';
import AddEditJournalDialog from '../accounts/AddEditJournalDialog';
import AddEditJournalColumnDialog from '../accounts/AddEditJournalColumnDialog';
import EditJournalColumnOrderDialog from '../accounts/EditJournalColumnOrderDialog';
import { selectActiveAccountAssetsAll, selectActiveAccountJournals } from '../accounts/accountsSlice';
import {
  getJournalColumn,
  isRightAlignJournalColumnType,
  transactionDataDisplay,
  Journal,
  JournalColumnRole,
  Asset,
} from '../../models/account';

interface JournalHeadersProps {
  journal: Journal;
  onEditColumnSettings?: (role: JournalColumnRole) => void;
  onEditJournalSettings?: () => void;
  onEditColumnLayout?: () => void;
}

const useJournalHeadersStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      padding: theme.spacing(0.75, 1),
      '&:last-child': {
        borderRight: 'none',
        paddingRight: theme.spacing(1),
      },
    },
  },
}));

function JournalHeaders(props: Readonly<JournalHeadersProps>) {
  const { journal, onEditColumnSettings, onEditJournalSettings, onEditColumnLayout } = props;
  const classes = useJournalHeadersStyles();
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);

  const handleEditJournalSettings = () => {
    onEditJournalSettings?.();
    setMenuAnchor(null);
  };

  const handleEditColumnLayout = () => {
    onEditColumnLayout?.();
    setMenuAnchor(null);
  };

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        {journal.columnOrder.map((role) => {
          const column = getJournalColumn(journal, role);
          return !column.hide && <TableCell key={role}>
            <Box display="flex">
              <Box component="span" flexGrow={1}>
                { column.name }
              </Box>
              <IconButton
                size="small"
                edge="end"
                onClick={() => onEditColumnSettings?.(role)}
              >
                <SettingsIcon fontSize="small" style={{fontSize:'1rem'}} />
              </IconButton>
            </Box>
          </TableCell>;
        })}
        <TableCell align="center">
          <IconButton color="secondary" onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor !== null}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleEditJournalSettings}>Settings</MenuItem>
        <MenuItem onClick={handleEditColumnLayout}>Columns</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

interface JournalRowProps {
  journal: number;
  transaction: number;
  assets?: Asset[];
  onEdit?: (journal: number, transaction: number) => void;
  onDelete?: (journal: number, transaction: number) => void;
}

const useJournalRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      padding: theme.spacing(0.25, 1),
      '&:last-child': {
        borderRight: 'none',
        paddingRight: theme.spacing(1),
      },
    },
  },
}));

function JournalRow(props: Readonly<JournalRowProps>) {
  const { journal: journalIndex, transaction: transactionIndex, assets, onEdit, onDelete } = props;
  const classes = useJournalRowStyles();
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);
  const journal = useSelector(selectActiveAccountJournals)[journalIndex];
  const transaction = journal?.transactions[transactionIndex];

  const handleEditTransaction = () => {
    onEdit?.(journalIndex, transactionIndex);
    setMenuAnchor(null);
  };

  const handleDeleteTransaction = () => {
    onDelete?.(journalIndex, transactionIndex);
    setMenuAnchor(null);
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        className={classes.root}
      >
        {journal?.columnOrder.map((role) => {
          const column = getJournalColumn(journal, role);
          return !column.hide && <TableCell
            align={isRightAlignJournalColumnType(column.type) ? 'right' : undefined}
            key={role}
          >
            { transaction && transactionDataDisplay(transaction, role, journal, assets) }
          </TableCell>;
        })}
        <TableCell align="center">
          <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Menu
        anchorEl={menuAnchor}
        open={menuAnchor !== null}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={handleEditTransaction}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteTransaction}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

interface JournalSheetProps {
  journal: number,
}

const useStyles = makeStyles((theme) => ({
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  title: {
    flexGrow: 1,
  },
  table: {
    borderRadius: 0,
    boxShadow: 'none',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function JournalSheet(props: Readonly<JournalSheetProps>) {
  const classes = useStyles();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<number>(-1);
  const [journalSettingsDialogOpen, setJournalSettingsDialogOpen] = useState(false);
  const [journalColumnOrderDialogOpen, setJournalColumnOrderDialogOpen] = useState(false);
  const [journalColumnDialogOpen, setJournalColumnDialogOpen] = useState(false);
  const [selectedJournalColumn, setSelectedJournalColumn] = useState<JournalColumnRole | null>(null);
  const assets = useSelector(selectActiveAccountAssetsAll);
  const journal = useSelector(selectActiveAccountJournals)[props.journal];

  const openAddDialog = () => {
    setSelectedTransaction(-1);
    setTransactionDialogOpen(true);
  };

  const openEditDialog = (transaction: number) => {
    setSelectedTransaction(transaction);
    setTransactionDialogOpen(true);
  };

  const openJournalColumnDialog = (role: JournalColumnRole) => {
    setSelectedJournalColumn(role);
    setJournalColumnDialogOpen(true);
  };

  return (
    <Box role="tabpanel">
      <TableContainer component={Paper} className={classes.table}>
        <Table
          size="small"
          stickyHeader
        >
          <TableHead>
            {journal && (
              <JournalHeaders
                journal={journal}
                onEditColumnSettings={openJournalColumnDialog}
                onEditJournalSettings={() => setJournalSettingsDialogOpen(true)}
                onEditColumnLayout={() => setJournalColumnOrderDialogOpen(true)}
              />
            )}
          </TableHead>
          <TableBody>
            {journal?.transactions.map((_, index) => (
              <JournalRow
                journal={props.journal}
                transaction={index}
                assets={assets}
                onEdit={(j, tx) => openEditDialog(tx)}
                key={index}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab color="secondary" className={classes.fab} onClick={openAddDialog}>
        <AddIcon />
      </Fab>
      <AddEditTransactionDialog
        journal={props.journal}
        transaction={selectedTransaction}
        open={transactionDialogOpen}
        onDialogClose={() => setTransactionDialogOpen(false)}
      />
      <AddEditJournalDialog
        journal={props.journal}
        open={journalSettingsDialogOpen}
        onDialogClose={() => setJournalSettingsDialogOpen(false)}
      />
      <AddEditJournalColumnDialog
        journal={props.journal}
        role={selectedJournalColumn}
        open={journalColumnDialogOpen}
        onDialogClose={() => setJournalColumnDialogOpen(false)}
      />
      <EditJournalColumnOrderDialog
        journal={props.journal}
        open={journalColumnOrderDialogOpen}
        onDialogClose={() => setJournalColumnOrderDialogOpen(false)}
        editHide
      />
    </Box>
  );
}
  
export default JournalSheet;