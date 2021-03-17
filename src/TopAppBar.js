import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

function TopAppBar() {
  return (
    <div>
      <AppBar>
        <Toolbar>
          <Typography variant="h6">
            Account
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopAppBar;