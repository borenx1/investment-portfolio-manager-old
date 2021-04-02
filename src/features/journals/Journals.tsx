import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AddIcon from '@material-ui/icons/Add';
import JournalSheet from './JournalSheet';
import AddTransactionTypeForm from './AddTransactionTypeForm';
import { selectActiveAccountJournals } from '../accounts/accountsSlice';

function Journals() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const journals = useSelector(selectActiveAccountJournals);

  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} aria-label="Journals tab">
          {journals.map((journal, index) =>
            <Tab label={journal.name} key={index} aria-label={`${journal.name} tab`} />
          )}
          <Tab icon={<AddIcon />} />
        </Tabs>
      </AppBar>
      <Box flexGrow={1}>
        {journals.map((journal, index) =>
          (activeTab === index) && <JournalSheet journal={index} key={index} />
        )}
      </Box>
      <AddTransactionTypeForm
        index={journals.length}
        active={activeTab === journals.length}
      />
    </React.Fragment>
  );
}

export default Journals;