import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import DeleteButton from '../../components/DeleteButton';
import AddEditAssetDialog, { FormFields } from './AddEditAssetDialog';
import { addAsset, editAsset, deleteAsset, selectActiveAccountAssets } from './accountsSlice';

const useStyles = makeStyles(theme => ({
  tableRow: {
    cursor: 'pointer',
  },
}));

function AccountAssetsSettings() {
  const classes = useStyles();
  const [addEditAssetDialogOpen, setAddEditAssetDialogOpen] = useState(false);
  // Index of the Asset to edit when the edit asset button is clicked, set to -1 to add new asset
  const [selectedAsset, setSelectedAsset] = useState(-1);
  const dispatch = useDispatch();
  const assets = useSelector(selectActiveAccountAssets);

  const openAddAssetDialog = () => {
    setSelectedAsset(-1);
    setAddEditAssetDialogOpen(true);
  };

  const openEditAssetDialog = (index: number) => {
    setSelectedAsset(index);
    setAddEditAssetDialogOpen(true);
  }

  const handleAddEditAsset = (fields: FormFields) => {
    if (selectedAsset < 0) {
      dispatch(addAsset({asset: fields}));
    } else {
      dispatch(editAsset({index: selectedAsset, asset: fields}));
    }
    setAddEditAssetDialogOpen(false);
  };

  const handleDeleteAsset = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
    dispatch(deleteAsset({index: index}));
    e.stopPropagation();
  };

  return (
    <React.Fragment>
      <SettingsSection>
        <IconButtonHeading
          variant="h6"
          gutterBottom
          title={'Assets'}
          icon={<AddIcon fontSize="small" />}
          onClick={openAddAssetDialog}
        />
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
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {assets.map((a, i) =>
                <TableRow hover className={classes.tableRow} onClick={() => openEditAssetDialog(i)} key={i}>
                  <TableCell>{ a.name }</TableCell>
                  <TableCell align="center">{ a.ticker }</TableCell>
                  <TableCell align="center">{ a.precision }</TableCell>
                  <TableCell align="center">{ a.pricePrecision }</TableCell>
                  <TableCell align="center">{ a.isCurrency ? 'Yes' : 'No' }</TableCell>
                  <TableCell align="center">{ a.symbol }</TableCell>
                  <TableCell align="center" size="small">
                    <DeleteButton onClick={e => handleDeleteAsset(e, i)} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </SettingsSection>
      <AddEditAssetDialog
        open={addEditAssetDialogOpen}
        onDialogClose={() => setAddEditAssetDialogOpen(false)}
        asset={assets[selectedAsset]}
        onSubmit={handleAddEditAsset}
      />
    </React.Fragment>
  );
}

export default AccountAssetsSettings;