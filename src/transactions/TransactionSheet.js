import Typography from '@material-ui/core/Typography';

function TransactionSheet(props) {

  return props.active && (
    <div role="tabpanel">
      <Typography variant="h3">{props.txType['name']}</Typography>
      <p>Transaction Sheet</p>
    </div>
  );
}
  
export default TransactionSheet;