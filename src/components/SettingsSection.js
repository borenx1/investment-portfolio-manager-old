import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

/**
 * React component. A visual wrapper for a settings section, put contents as children.
 */
function SettingsSection(props) {
  const classes = useStyles();

  return (
    <Paper component="section" elevation={0} variant="outlined" className={clsx(classes.root, props.className)}>
      { props.children }
    </Paper>
  );
}

export default SettingsSection;