
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
import { Transaction } from '../../models/Account';

interface JournalProps {
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
  tableCell: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderRight: 'none',
    },
  },
}));

function Journal(props: JournalProps) {
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
            <TableRow>
              <TableCell className={classes.tableCell}>{ journal.columns.date.name }</TableCell>
              <TableCell className={classes.tableCell}>{ journal.columns.base.name }</TableCell>
              <TableCell className={classes.tableCell}>{ journal.columns.quote.name }</TableCell>
              <TableCell className={classes.tableCell}>{ journal.columns.baseAmount.name }</TableCell>
              <TableCell className={classes.tableCell}>{ journal.columns.quoteAmount.name }</TableCell>
              <TableCell className={classes.tableCell}>{ journal.columns.price.name }</TableCell>
              <TableCell className={classes.tableCell}>{ journal.columns.notes.name }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {journal.transactions.map((tx, index) => (
              <TableRow hover key={index}>
                <TableCell align="right" className={classes.tableCell}>{tx.date}</TableCell>
                <TableCell align="right" className={classes.tableCell}>{tx.base}</TableCell>
                <TableCell align="right" className={classes.tableCell}>{tx.quote}</TableCell>
                <TableCell align="right" className={classes.tableCell}>{tx.baseAmount}</TableCell>
                <TableCell align="right" className={classes.tableCell}>{tx.quoteAmount}</TableCell>
                <TableCell align="right" className={classes.tableCell}>{tx.quoteAmount / tx.baseAmount}</TableCell>
                <TableCell className={classes.tableCell}>{tx.notes}</TableCell>
              </TableRow>
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
  
export default Journal;