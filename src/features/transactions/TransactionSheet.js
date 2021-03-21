
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
import { selectActiveAccountObject } from './transactionsSlice';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function TransactionSheet(props) {
  const classes = useStyles();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogEdit, setDialogEdit] = useState(false);
  // const account = useSelector(selectActiveAccountObject);

  const openAddDialog = () => {
    setDialogEdit(false);
    setDialogOpen(true);
  };
  const openEditDialog = (tx) => {
    setDialogEdit(true);
    setDialogOpen(true);
  };

  return props.active && (
    <div role="tabpanel">
      <TableContainer component={Paper}>
        <Table
          size={'small'}
          className={classes.table}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>{ props.txType.columns.date.name }</TableCell>
              <TableCell>{ props.txType.columns.base.name }</TableCell>
              <TableCell>{ props.txType.columns.quote.name }</TableCell>
              <TableCell>{ props.txType.columns.trade.name }</TableCell>
              <TableCell>{ props.txType.columns.baseAmount.name }</TableCell>
              <TableCell>{ props.txType.columns.quoteAmount.name }</TableCell>
              <TableCell>{ props.txType.columns.price.name }</TableCell>
              <TableCell>{ props.txType.columns.notes.name }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.txType.transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell align="right">{tx.date}</TableCell>
                <TableCell align="right">{tx.base}</TableCell>
                <TableCell align="right">{tx.quote}</TableCell>
                <TableCell>{tx.buy ? "Buy" : "Sell"}</TableCell>
                <TableCell align="right">{tx.baseAmount}</TableCell>
                <TableCell align="right">{tx.quoteAmount}</TableCell>
                <TableCell align="right">{tx.quoteAmount / tx.baseAmount}</TableCell>
                <TableCell>{tx.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Fab color="secondary" className={classes.fab} onClick={() => openAddDialog()}>
        <AddIcon />
      </Fab>
      <AddEditTransactionDialog
        txType={props.txType}
        index={props.index}
        open={dialogOpen}
        edit={dialogEdit}
        onDialogClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
  
export default TransactionSheet;