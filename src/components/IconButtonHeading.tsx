import { PropTypes } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Variant } from '@material-ui/core/styles/createTypography';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

interface Props {
  title: string;
  icon: JSX.Element;
  variant?: Variant;
  gutterBottom?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  buttonColor?: PropTypes.Color;
}

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
function IconButtonHeading({variant = 'h6', ...props}: Props) {
  const classes = useStyles();
  return (
    <Typography variant={variant} gutterBottom={props.gutterBottom}>
      { props.title }
      <IconButton size="small" onClick={props.onClick} color={props.buttonColor} className={classes.button}>
        { props.icon }
      </IconButton>
    </Typography>
  );
}

export default IconButtonHeading;