import Typography from '@material-ui/core/Typography';

function AddTransactionTypeForm(props) {

  return props.active && (
    <div role="tabpanel">
      <Typography variant="h3">Add Transaction Type</Typography>
    </div>
  );
}
  
export default AddTransactionTypeForm;