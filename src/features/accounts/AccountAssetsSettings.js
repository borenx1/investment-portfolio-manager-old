import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import AddEditAssetDialog from './AddEditAssetDialog';
import { addAsset, editAsset, selectActiveAccount } from './accountsSlice';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
}));

function AccountAssetsSettings(props) {
  const classes = useStyles();
  const [addEditAssetDialogOpen, setAddEditAssetDialogOpen] = useState(false);
  // Index of the Asset to edit when the edit asset button is clicked, set to -1 to add new asset
  const [selectedAsset, setSelectedAsset] = useState(-1);
  const [addEditAssetFields, setAddEditAssetFields] = useState({
    name: '',
    ticker: '',
    precision: '',
    pricePrecision: '',
    isCurrency: false,
    symbol: '',
  });
  const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const assets = account.assets;

  const openAddAssetDialog = () => {
    setSelectedAsset(-1);
    setAddEditAssetDialogOpen(true);
  };

  const handleAddEditAsset = () => {
    if (selectedAsset < 0) {
      // Add
      dispatch(addAsset({asset: {...addEditAssetFields}}));
    } else {
      // Edit
      dispatch(editAsset({asset: {...addEditAssetFields}, index: selectedAsset}));
    }
    setAddEditAssetDialogOpen(false);
  };

  return (
    <React.Fragment>
      <Paper component="section" elevation={0} variant="outlined" className={classes.root}>
        <Typography variant="h6">Assets</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Ticker</TableCell>
                <TableCell align="center">Precision</TableCell>
                <TableCell align="center">Price Precision</TableCell>
                <TableCell align="center">Currency</TableCell>
                <TableCell align="center">Symbol</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((a, i) =>
                <TableRow>
                  <TableCell>{ a.name }</TableCell>
                  <TableCell align="center">{ a.ticker }</TableCell>
                  <TableCell align="center">{ a.precision }</TableCell>
                  <TableCell align="center">{ a.pricePrecision }</TableCell>
                  <TableCell align="center">{ a.isCurrency ? 'Yes' : 'No' }</TableCell>
                  <TableCell align="center">{ a.symbol }</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddAssetDialog}
        >
            Add New Asset
        </Button>
      </Paper>
      <AddEditAssetDialog
        open={addEditAssetDialogOpen}
        onDialogClose={() => setAddEditAssetDialogOpen(false)}
        edit={selectedAsset === -1 ? null : assets[selectedAsset]}
        fields={addEditAssetFields}
        onFieldsChange={fields => setAddEditAssetFields(fields)}
        onSubmit={handleAddEditAsset}
      />
    </React.Fragment>
  );
}

export default AccountAssetsSettings;