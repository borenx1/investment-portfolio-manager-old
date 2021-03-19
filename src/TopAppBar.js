import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

function TopAppBar(props) {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton onClick={props.onMenuClick} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">Account</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;