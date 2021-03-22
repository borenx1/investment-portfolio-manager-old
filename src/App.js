import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import TopAppBar from './features/navigation/TopAppBar';
import SideDrawer from './features/navigation/SideDrawer';
import AppContent from './AppContent';
import { addDefaultAccount } from './features/accounts/accountsSlice';

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
    this.props.dispatch(addDefaultAccount('Coinbase'));
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