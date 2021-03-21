import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import TransactionSheet from './TransactionSheet';
import AddTransactionTypeForm from './AddTransactionTypeForm';
import { selectActiveAccountObject } from './transactionsSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
}));

function Transactions(props) {
  const classes = useStyles();
  const account = useSelector(selectActiveAccountObject);
  const dispatch = useDispatch();
  const transactionTypes = account ? account.txTypes : [];
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} aria-label="Transactions tab">
          {/* TODO update key */}
          {/* TODO aria labels */}
          {transactionTypes.map((txType, index) =>
            <Tab label={txType['name']} key={index} />
          )}
          <Tab icon={<AddIcon />} />
        </Tabs>
      </AppBar>
      {/* TODO update key */}
      {transactionTypes.map((txType, index) =>
        <TransactionSheet txType={txType} index={index} active={activeTab === index} key={index} />
      )}
      <AddTransactionTypeForm
        index={transactionTypes.length}
        active={activeTab === transactionTypes.length}
        key={transactionTypes.length}
      />
    </div>
  );
}

export default Transactions;