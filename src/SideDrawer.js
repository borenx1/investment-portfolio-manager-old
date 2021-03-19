import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CreateIcon from '@material-ui/icons/Create';

/**
 * See https://material-ui.com/api/drawer/.
 */
function SideDrawer(props) {
  return (
    <Drawer
      variant="persistent"
      anchor="left"    
      open={props.open}
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
          <ListItemText primary="Inbox" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <CreateIcon />
          </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default SideDrawer;