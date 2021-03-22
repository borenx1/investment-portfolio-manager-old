
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
import { selectActiveAccount } from '../accounts/accountsSlice';

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
        >
          <TableHead>
            <TableRow>
              <TableCell>{ props.journal.columns.date.name }</TableCell>
              <TableCell>{ props.journal.columns.base.name }</TableCell>
              <TableCell>{ props.journal.columns.quote.name }</TableCell>
              <TableCell>{ props.journal.columns.baseAmount.name }</TableCell>
              <TableCell>{ props.journal.columns.quoteAmount.name }</TableCell>
              <TableCell>{ props.journal.columns.price.name }</TableCell>
              <TableCell>{ props.journal.columns.notes.name }</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.journal.transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell align="right">{tx.date}</TableCell>
                <TableCell align="right">{tx.base}</TableCell>
                <TableCell align="right">{tx.quote}</TableCell>
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
        journal={props.journal}
        index={props.index}
        open={dialogOpen}
        edit={dialogEdit}
        onDialogClose={() => setDialogOpen(false)}
      />
    </div>
  );
}
  
export default TransactionSheet;