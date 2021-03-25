import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles(theme => ({
  button: {
    marginLeft: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1),
  },
}));

/**
 * A React component. A heading with an icon button on the right.
 * 
 * Props:
 * - title: The title.
 * - variant: The variant for the Typography component. Default "h6".
 * - gutterBottom: Add margin to the Typography component.
 * - icon: The icon component.
 * - buttonColor: The color of the IconButton component.
 * - onClick: Callback when the icon button is clicked.
 */
function IconButtonHeading(props) {
  const classes = useStyles();
  return (
    <Typography variant={props.variant || 'h6'} gutterBottom={Boolean(props.gutterBottom)}>
      { props.title }
      <IconButton size="small" onClick={props.onClick} color={props.buttonColor} className={classes.button}>
        { props.icon }
      </IconButton>
    </Typography>
  );
}

export default IconButtonHeading;