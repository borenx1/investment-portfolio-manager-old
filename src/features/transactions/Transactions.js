import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import TransactionSheet from './TransactionSheet';
import AddTransactionTypeForm from './AddTransactionTypeForm';
import { selectActiveAccount } from '../accounts/accountsSlice';

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    // backgroundColor: theme.palette.background.paper,
  },
}));

function Transactions(props) {
  const classes = useStyles();
  const account = useSelector(selectActiveAccount);
  const dispatch = useDispatch();
  const journals = account ? account.journals : [];
  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} aria-label="Transactions tab">
          {/* TODO update key */}
          {/* TODO aria labels */}
          {journals.map((journal, index) =>
            <Tab label={journal['name']} key={index} />
          )}
          <Tab icon={<AddIcon />} />
        </Tabs>
      </AppBar>
      {/* TODO update key */}
      {journals.map((journal, index) =>
        <TransactionSheet journal={journal} index={index} active={activeTab === index} key={index} />
      )}
      <AddTransactionTypeForm
        index={journals.length}
        active={activeTab === journals.length}
        key={journals.length}
      />
    </div>
  );
}

export default Transactions;