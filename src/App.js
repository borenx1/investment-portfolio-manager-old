import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TopAppBar from './TopAppBar';
import SideDrawer from './SideDrawer';
import AppContent from './AppContent';

const styles = {
  root: {
    display: 'flex'
  },
  content: {
    flexGrow: 1,
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // [account: {
      //   txTypes: [{name: 'Trading', dateTimeformat: 'day', txs: [Tx,]}],
      //   assets: {BTC: {precision: 8, pricePrecision, feeCurrency: 'base'}},
      //   baseCurrency: 'USD'},
      // ]
      accounts: [],
      activeAccount: null,
      activePage: null,
      drawerOpen: false
    };

    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
    this.handleDrawerNavigate = this.handleDrawerNavigate.bind(this);
  }

  openDrawer() {
    this.setState({drawerOpen: true});
  }

  closeDrawer() {
    this.setState({drawerOpen: false});
  }

  handleDrawerNavigate(page) {
    this.setState({activePage: page});
  }

  render() {
    return (
      <React.Fragment>
        <div className={this.props.classes.root}>
          <TopAppBar
            onMenuClick={this.openDrawer}
            drawerOpen={this.state.drawerOpen}
          />
          <aside>
            <SideDrawer open={this.state.drawerOpen} onClose={this.closeDrawer} onNavigate={this.handleDrawerNavigate} />
          </aside>
          <main className={this.props.classes.content}>
            {/* Spacing with (height = top app bar height) so content is not clipped by the fixed app bar */}
            <Toolbar />
            <AppContent account={this.state.activeAccount} page={this.state.activePage} />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);