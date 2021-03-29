
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import AddEditTransactionDialog from './AddEditTransactionDialog';
import { selectActiveAccountJournals } from '../accounts/accountsSlice';
import { Journal, Transaction } from '../../models/Account';

interface JournalHeadersProps {
  readonly journal: Journal,
}

const useJournalHeadersStyles = makeStyles((theme) => ({
  tableCell: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderRight: 'none',
    },
  },
}));

function JournalHeaders(props: JournalHeadersProps) {
  const classes = useJournalHeadersStyles();

  return (
    <TableRow>
      {props.journal.columnOrder.map((role) => {
        const column = typeof role === 'string' ? props.journal.columns[role] : props.journal.columns.extra[role];
        return !column.hide && <TableCell className={classes.tableCell} key={role}>{column.name}</TableCell>;
      })}
    </TableRow>
  );
}

interface JournalRowProps {
  readonly journal: Journal,
  readonly transaction: Transaction,
}

const useJournalRowStyles = makeStyles((theme) => ({
  tableCell: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderRight: 'none',
    },
  },
}));

function JournalRow(props: JournalRowProps) {
  const { journal, transaction } = props;
  const classes = useJournalRowStyles();

  return (
    <TableRow hover>
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
        return !column.hide && <TableCell
          className={classes.tableCell}
          key={role}
        >
          { data }
        </TableCell>;
      })}
    </TableRow>
  );
}

interface JournalSheetProps {
  readonly journal: number,
}

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 0,
    boxShadow: 'none',
  },
  fab: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function JournalSheet(props: JournalSheetProps) {
  const classes = useStyles();
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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

  return (
    <div role="tabpanel">
      <TableContainer component={Paper} className={classes.root}>
        <Table
          size="small"
          stickyHeader
        >
          <TableHead>
            <JournalHeaders journal={journal} />
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
        open={transactionDialogOpen}
        edit={selectedTransaction}
        onDialogClose={() => setTransactionDialogOpen(false)}
      />
    </div>
  );
}
  
export default JournalSheet;