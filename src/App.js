import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route } from "react-router-dom";
import Box from '@material-ui/core/Box';
import Toolbar from '@material-ui/core/Toolbar';
import TopAppBar from './features/navigation/TopAppBar';
import SideDrawer from './features/navigation/SideDrawer';
import Journals from './features/journals/Journals';
import { addDefaultAccount } from './features/accounts/accountsSlice';
import CapitalChanges from './features/capital-changes/CapitalChanges';
import AssetStatements from './features/asset-statements/AssetStatements';
import AccountSettings from './features/accounts/AccountSettings';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  openDrawer() {
    this.setState({drawerOpen: true});
  }

  closeDrawer() {
    this.setState({drawerOpen: false});
  }

  componentDidMount() {
    // Init with test data
    this.props.dispatch(addDefaultAccount('Coinbase'));
  }

  render() {
    return (
      <Box display="flex">
        <TopAppBar
          onMenuClick={this.openDrawer}
          drawerOpen={this.state.drawerOpen}
        />
        <aside>
          <SideDrawer open={this.state.drawerOpen} onClose={this.closeDrawer} />
        </aside>
        <Box flexGrow={1} display="flex" flexDirection="column" component="main">
          {/* Spacing with (height = top app bar height) so content is not clipped by the fixed app bar */}
          <Toolbar />
          <Switch>
            <Route path="/journals">
              <Journals />
            </Route>
            <Route path="/capital-changes">
              <CapitalChanges />
            </Route>
            <Route path="/asset-statements">
              <AssetStatements />
            </Route>
            <Route path="/account-settings">
              <AccountSettings />
            </Route>
            <Route path="/">
              <Journals />
            </Route>
          </Switch>
        </Box>
      </Box>
    );
  }
}

export default connect()(App);