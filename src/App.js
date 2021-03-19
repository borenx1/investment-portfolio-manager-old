import React from 'react';
import TopAppBar from './TopAppBar';
import SideDrawer from './SideDrawer';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {drawerOpen: false};
    this.openDrawer = this.openDrawer.bind(this);
    this.closeDrawer = this.closeDrawer.bind(this);
  }

  openDrawer() {
    this.setState({drawerOpen: true});
  }

  closeDrawer() {
    this.setState({drawerOpen: false});
  }

  render() {
    return (
      <div>
        <TopAppBar onMenuClick={this.openDrawer} />
        <main>
          <aside>
            <SideDrawer open={this.state.drawerOpen} onClose={this.closeDrawer} />
          </aside>
          Content
        </main>
      </div>
    );
  }
}

export default App;
