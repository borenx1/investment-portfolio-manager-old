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
      accounts: [],
      activeAccount: null,
      activePage: 'transactions',
      drawerOpen: false,
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

  handleAccountChange(account) {
    this.setState({activeAccount: 0});
  }

  getActiveAccount() {
    const accounts = this.state.accounts;
    if (!accounts || accounts.length === 0) {
      // TODO create default account
      console.warn('No accounts loaded');
      return null;
    }
    const activeAccount = this.state.activeAccount;
    // Set active account to the first one if out of range
    if (activeAccount >= accounts.length) {
      // TODO figure out what to do
      return null;
      // this.setState({activeAccount: 0});
    }
    return accounts[activeAccount];
  }

  getAppBarTitle() {
    const activeAccount = this.getActiveAccount();
    return activeAccount ? activeAccount['name'] : 'Investmest Portfolio Manager';
  }

  componentDidMount() {
    // Init with test data
    this.setState({activeAccount: 0, accounts: [{
      name: 'Coinbase Account',
      txTypes: [
        {
          name: 'Trading', txs: [], columns: {
            date: {name: 'Date', dateTimeFormat: 'date', hide: false},
            base: {name: 'Asset', hide: false},
            quote: {name: 'Quote currency', hide: false},
            baseAmount: {},
            quoteAmount: {},
            feeBase: {},
            feeQuote: {},
            notes: {},
            misc: [],
          }, columnOrder: ['date', 'base', 'baseAmount', 'quote', 'quoteAmount', 'price', 'feeBase', 'feeQuote', 'notes']
        },
        {
          name: 'Misc fees', txs: [],
        }
      ],
      assets: {BTC: {precision: 8, pricePrecision: 6, feeCurrency: 'base'}},
      baseCurrency: 'USD'
    }]});
  }

  render() {
    return (
      <React.Fragment>
        <div className={this.props.classes.root}>
          <TopAppBar
            title={this.getAppBarTitle()}
            onMenuClick={this.openDrawer}
            drawerOpen={this.state.drawerOpen}
          />
          <aside>
            <SideDrawer open={this.state.drawerOpen} onClose={this.closeDrawer} onNavigate={this.handleDrawerNavigate} />
          </aside>
          <main className={this.props.classes.content}>
            {/* Spacing with (height = top app bar height) so content is not clipped by the fixed app bar */}
            <Toolbar />
            <AppContent account={this.getActiveAccount()} page={this.state.activePage} />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(App);