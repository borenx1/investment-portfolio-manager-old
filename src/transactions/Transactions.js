import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionSheet from './TransactionSheet';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function Transactions(props) {
  const classes = useStyles();
  const transactionTypes = props.account && 'txTypes' in props.account ? props.account.txTypes : [];
  const [activeTab, setActiveTab] = React.useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className={classes.root}>
    {/* <div> */}
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Transactions tab">
          {/* TODO update key */}
          {/* TODO aria labels */}
          {transactionTypes.map((txType, index) =>
            <Tab label={txType['name']} key={index} />
          )}
          {/* <Tab label="Item Three" {...a11yProps(2)} /> */}
        </Tabs>
      </AppBar>
      {/* TODO update key */}
      {transactionTypes.map((txType, index) =>
        <TransactionSheet txType={txType} index={index} active={activeTab === index} key={index} />
      )}
    </div>
  );
}

export default Transactions;