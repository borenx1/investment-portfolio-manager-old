import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TopAppBar from './features/navigation/TopAppBar';
import SideDrawer from './features/navigation/SideDrawer';
import AppContent from './AppContent';
import { addAccount } from './features/transactions/transactionsSlice';
import { Account } from './models/Account';

const styles = {
  root: {
    // Allow content to grow
    display: 'flex',
  },
  content: {
    // Let content grow horizontally
    flexGrow: 1,
  }
}

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
    this.props.dispatch(addAccount(new Account('Coinbase')));
    // this.setState({activeAccount: 0, accounts: [{
    //   name: 'Coinbase Account',
    //   txTypes: [
    //     {
    //       name: 'Trading', txs: [], columns: {
    //         date: {name: 'Date', dateTimeFormat: 'date', hide: false},
    //         base: {name: 'Asset', hide: false},
    //         quote: {name: 'Quote currency', hide: false},
    //         baseAmount: {},
    //         quoteAmount: {},
    //         feeBase: {},
    //         feeQuote: {},
    //         notes: {},
    //         misc: [],
    //       }, columnOrder: ['date', 'base', 'baseAmount', 'quote', 'quoteAmount', 'price', 'feeBase', 'feeQuote', 'notes']
    //     },
    //     {
    //       name: 'Misc fees', txs: [],
    //     }
    //   ],
    //   assets: {BTC: {precision: 8, pricePrecision: 6, feeCurrency: 'base'}},
    //   baseCurrency: 'USD'
    // }]});
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
            <SideDrawer open={this.state.drawerOpen} onClose={this.closeDrawer} />
          </aside>
          <main className={this.props.classes.content}>
            {/* Spacing with (height = top app bar height) so content is not clipped by the fixed app bar */}
            <Toolbar />
            <AppContent />
          </main>
        </div>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(connect()(App));