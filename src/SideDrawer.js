import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CreateIcon from '@material-ui/icons/Create';
import BookIcon from '@material-ui/icons/Book';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles({
  root: {
    
  },
  drawerPaper: {
    width: 240,
  }
});

/**
 * See https://material-ui.com/api/drawer/.
 */
function SideDrawer(props) {
  const classes = useStyles();
  return (
    <Drawer
      variant="persistent"
      anchor="left"    
      open={props.open}
      className={classes.root}
      classes={{paper: classes.drawerPaper}}
    >
      <IconButton onClick={props.onClose}>
        <ChevronLeftIcon />
      </IconButton>
      <Divider />
      <List component="nav" aria-label="// TODO">
        <ListItem button>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Transactions" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Captial changes" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Journals" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="// TODO">
        <ListItem>
          <ListItemText primary="Financials" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Monthly" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Quarterly" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Biyearly" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Yearly" />
        </ListItem>
      </List>
      <Divider />
      <List component="nav" aria-label="Account settings">
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Account settings" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default SideDrawer;