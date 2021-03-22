import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import { selectAccounts, selectActiveAccountIndex, selectActiveAccountName, changeAccount } from '../accounts/accountsSlice';
import { drawerWidth } from '../../constants';
import React from 'react';

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
  // Controls the showing of the "change account" menu
  const [menuAnchor, setMenuAnchor] = useState(null);
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const activeAccountIndex = useSelector(selectActiveAccountIndex);
  const activeAccountName = useSelector(selectActiveAccountName);

  const handleChangeAccount = (index) => (e) => {
    dispatch(changeAccount(index));
    setMenuAnchor(null);
  }

  return (
    <React.Fragment>
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
          <IconButton
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            color="inherit"
            aria-label="Change account"
            aria-haspopup="true"
          >
            <ArrowDropDownCircleIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        {accounts.map((a, index) => (
          <MenuItem onClick={handleChangeAccount(index)} selected={activeAccountIndex} key={index}>
            { a.name }
          </MenuItem>
        ))}
        <MenuItem>All Accounts</MenuItem>
        <MenuItem>Create New Account</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default TopAppBar;