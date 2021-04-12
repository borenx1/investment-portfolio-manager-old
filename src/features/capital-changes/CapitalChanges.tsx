import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function CapitalChanges() {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <React.Fragment>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} aria-label="Capital changes tabs">
          <Tab label="Add Capital" aria-label="Add Capital tab" />
          <Tab label="Drawings" aria-label="Drawings tab" />
          <Tab label="Transfer" aria-label="Transfer tab" />
          <Tab label="Consolidated" aria-label="Consolidated tab" />
        </Tabs>
      </AppBar>
      { activeTab === 0 && <h1>Add Capital</h1> }
      { activeTab === 1 && <h1>Drawings</h1> }
      { activeTab === 2 && <h1>Transfer</h1> }
      { activeTab === 3 && <h1>Consolidated</h1> }
    </React.Fragment>
  );
}
  
export default CapitalChanges;