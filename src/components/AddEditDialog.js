import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

/**
 * A dialog to add or edit an object.
 * 
 * Props:
 * - objectName: Name of the object to add or edit. Appears in the title.
 * - edit: true for edit mode, false for add mode (affects text).
 * - open: Dialog shows if true.
 * - onClose - Function called when the dialog requests to be closed (cancel button or click away).
 * - onEnter - Function called before the dialog is opened.
 * - onReset - Function called when the "reset" button is clicked.
 * - onSubmit - Function called when the "Add/Edit" button is clicked.
 * - dividers - Display the DialogContent dividers if true
 */
function AddEditDialog(props) {
  return (
    <Dialog open={props.open} onClose={props.onClose} onEnter={props.onEnter}>
      <DialogTitle>{ `${props.edit ? 'Edit' : 'Add'} ${props.objectName || 'Item'}` }</DialogTitle>
      <DialogContent dividers={Boolean(props.dividers)}>
        { props.children }
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={props.onReset} color="primary">
          Reset
        </Button>
        <Button onClick={props.onSubmit} color="primary">
          { props.edit ? 'Edit' : 'Add' }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddEditDialog;