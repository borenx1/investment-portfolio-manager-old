import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function TopAppBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Account</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;