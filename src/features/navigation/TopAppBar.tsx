import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowDropDownCircleIcon from '@material-ui/icons/ArrowDropDownCircle';
import { selectAccounts, selectActiveAccountIndex, selectActiveAccountName, switchAccount } from '../accounts/accountsSlice';
import { drawerWidth } from '../../constants';

interface Props {
  readonly drawerOpen: boolean;
  readonly onMenuClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const useStyles = makeStyles<Theme, Props>(theme => ({
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

function TopAppBar(props: Props) {
  const classes = useStyles(props);
  // Controls the showing of the "change account" menu
  const [menuAnchor, setMenuAnchor] = useState<Element | null>(null);
  const dispatch = useDispatch();
  const accounts = useSelector(selectAccounts);
  const activeAccountIndex = useSelector(selectActiveAccountIndex);
  const activeAccountName = useSelector(selectActiveAccountName);

  const handleSwitchAccount = (index: number) => {
    dispatch(switchAccount(index));
    setMenuAnchor(null);
  };

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarDrawerOpen!]: props.drawerOpen
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
          <MenuItem onClick={() => handleSwitchAccount(index)} selected={activeAccountIndex === index} key={index}>
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