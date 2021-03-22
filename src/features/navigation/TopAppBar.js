import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { selectActiveAccountName } from '../accounts/accountsSlice';
import { drawerWidth } from '../../constants';

const useStyles = makeStyles(theme => ({
  root: {

  },
  menuButton: {
    marginRight: theme.spacing(2),
    display: props => props.drawerOpen ? 'none' : 'initial'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarDrawerOpen: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth})`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  }
}));

function TopAppBar(props) {
  const classes = useStyles(props);
  const activeAccountName = useSelector(selectActiveAccountName);
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarDrawerOpen]: props.drawerOpen
      })}
    >
      <Toolbar>
        <IconButton
          onClick={props.onMenuClick}
          color="inherit"
          aria-label="menu"
          className={classes.menuButton}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">{ activeAccountName }</Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;