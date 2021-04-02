
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AddEditTransactionDialog from './AddEditTransactionDialog';
import AddEditJournalDialog from '../accounts/AddEditJournalDialog';
import AddEditJournalColumnDialog from '../accounts/AddEditJournalColumnDialog';
import EditJournalColumnOrderDialog from '../accounts/EditJournalColumnOrderDialog';
import { selectActiveAccountJournals } from '../accounts/accountsSlice';
import { Journal, JournalColumnRole, Transaction } from '../../models/account';

interface JournalHeadersProps {
  journal: Journal,
  onSettingsClick?: (role: JournalColumnRole) => void,
}

const useJournalHeadersStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  columnSettings: {
    marginLeft: 'auto',
  },
}));

function JournalHeaders(props: Readonly<JournalHeadersProps>) {
  const classes = useJournalHeadersStyles();

  return (
    <TableRow className={classes.root}>
        {props.journal.columnOrder.map((role) => {
          const column = typeof role === 'string' ? props.journal.columns[role] : props.journal.columns.extra[role];
          return !column.hide && <TableCell key={role}>
            <Box display="flex">
              {column.name}
              <IconButton
                size="small"
                edge="end"
                onClick={() => props.onSettingsClick?.(role)}
                className={classes.columnSettings}
              >
                <SettingsIcon fontSize="small" style={{fontSize:'1rem'}} />
              </IconButton>
            </Box>
          </TableCell>;
        })}
    </TableRow>
  );
}

interface JournalRowProps {
  journal: Journal,
  transaction: Transaction,
}

const useJournalRowStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      borderBottom: '1px solid rgba(224, 224, 224, 1)',
      borderRight: '1px solid rgba(224, 224, 224, 1)',
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
}));

function JournalRow(props: Readonly<JournalRowProps>) {
  const { journal, transaction } = props;
  const classes = useJournalRowStyles();

  return (
    <TableRow hover className={classes.root}>
      {journal.columnOrder.map((role) => {
        const column = typeof role === 'string' ? journal.columns[role] : journal.columns.extra[role];
        let data: string | number | boolean;
        if (role === 'price') {
          data = transaction.quoteAmount / transaction.baseAmount;
        } else if (typeof role === 'string') {
          data = props.transaction[role];
        } else {
          data = props.transaction.extra[column.name];
          // Convert boolean data to readable values
          if (typeof data === 'boolean') data = data ? 'Yes' : 'No';
        }
        return !column.hide && <TableCell key={role}>
          { data }
        </TableCell>;
      })}
    </TableRow>
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
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [journalSettingsDialogOpen, setJournalSettingsDialogOpen] = useState(false);
  const [journalColumnOrderDialogOpen, setJournalColumnOrderDialogOpen] = useState(false);
  const [journalColumnDialogOpen, setJournalColumnDialogOpen] = useState(false);
  const [selectedJournalColumn, setSelectedJournalColumn] = useState<JournalColumnRole | null>(null);
  const journals = useSelector(selectActiveAccountJournals);
  const journal = journals[props.journal];

  const openAddDialog = () => {
    setSelectedTransaction(null);
    setTransactionDialogOpen(true);
  };

  const openEditDialog = (tx: Transaction) => {
    setSelectedTransaction(null);
    setTransactionDialogOpen(true);
  };

  const openJournalSettingsDialog = () => {
    setJournalSettingsDialogOpen(true);
    setMenuAnchor(null);
  }

  const openJournalColumnOrderDialog = () => {
    setJournalColumnOrderDialogOpen(true);
    setMenuAnchor(null);
  };

  const openJournalColumnDialog = (role: JournalColumnRole) => {
    setSelectedJournalColumn(role);
    setJournalColumnDialogOpen(true);
  };

  return (
      <Box role="tabpanel">
        <Toolbar className={classes.toolbar}>
          <Typography variant="h6" className={classes.title}>
            { journal.name }
          </Typography>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
        </Toolbar>
        <TableContainer component={Paper} className={classes.table}>
          <Table
            size="small"
            stickyHeader
          >
            <TableHead>
              <JournalHeaders journal={journal} onSettingsClick={openJournalColumnDialog} />
            </TableHead>
            <TableBody>
              {journal.transactions.map((tx, index) => (
                <JournalRow journal={journal} transaction={tx} key={index} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Fab color="secondary" className={classes.fab} onClick={openAddDialog}>
          <AddIcon />
        </Fab>
        <AddEditTransactionDialog
          journal={journal}
          edit={selectedTransaction}
          open={transactionDialogOpen}
          onDialogClose={() => setTransactionDialogOpen(false)}
        />
        <AddEditJournalDialog
          journal={props.journal}
          open={journalSettingsDialogOpen}
          onDialogClose={() => setJournalSettingsDialogOpen(false)}
        />
        <AddEditJournalColumnDialog
          index={props.journal}
          role={selectedJournalColumn}
          open={journalColumnDialogOpen}
          onDialogClose={() => setJournalColumnDialogOpen(false)}
        />
        <EditJournalColumnOrderDialog
          index={props.journal}
          open={journalColumnOrderDialogOpen}
          onDialogClose={() => setJournalColumnOrderDialogOpen(false)}
        />
        <Menu
          anchorEl={menuAnchor}
          open={menuAnchor !== null}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem onClick={openJournalSettingsDialog}>Settings</MenuItem>
          <MenuItem onClick={openJournalColumnOrderDialog}>Columns</MenuItem>
        </Menu>
      </Box>
  );
}
  
export default JournalSheet;