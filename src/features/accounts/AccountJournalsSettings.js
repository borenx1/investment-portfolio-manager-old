import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import AddEditAssetDialog from './AddEditAssetDialog';
import SettingsSection from '../../components/SettingsSection';
import IconButtonHeading from '../../components/IconButtonHeading';
import { addAsset, editAsset, selectActiveAccount } from './accountsSlice';

function JournalColumnRow(props) {
  const { role, journalColumn } = props;
  return (
    <TableRow>
      <TableCell>{ role }</TableCell>
      <TableCell>{ journalColumn.name }</TableCell>
      <TableCell>{ journalColumn.type }</TableCell>
      <TableCell>{ journalColumn.type === 'number' && journalColumn.precision }</TableCell>
      <TableCell>{ journalColumn.type === 'date' && journalColumn.dateTimeFormat }</TableCell>
      <TableCell>{ journalColumn.hide ? 'Yes' : 'No' }</TableCell>
    </TableRow>
  );
}

const useJournalRowStyles = makeStyles(theme => ({
  mainRow: {
    cursor: 'pointer',
    '& > *': {    // select all children
      borderBottom: 'none',   // remove the bottom border of the TableCell children
    },
  },
  collapsibleCell: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  columnOrderChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

function JournalRow(props) {
  const classes = useJournalRowStyles();
  const { journal } = props;
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow hover className={classes.mainRow}>
        <TableCell>{journal.name}</TableCell>
        <TableCell align="center">{journal.type}</TableCell>
        <TableCell align="center">
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} className={classes.collapsibleCell}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <IconButtonHeading
                variant="h6"
                title={'Columns'}
                icon={<AddIcon fontSize="small" />}
              />
              <Table size="small" aria-label="Journal columns">
                <TableHead>
                  <TableRow>
                    <TableCell>Role</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Precision</TableCell>
                    <TableCell>Date Format</TableCell>
                    <TableCell>Hide</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(journal.columns).map(pair => 
                    pair[0] !== 'extra' && <JournalColumnRow role={pair[0]} journalColumn={pair[1]} key={pair[0]} />
                  )}
                  {journal.columns.extra.map((col, i) =>
                    <JournalColumnRow role={'extra'} journalColumn={col} key={i} />
                  )}
                </TableBody>
              </Table>
              <Box mt={1}>
                <IconButtonHeading
                  variant="h6"
                  title={'Column Order'}
                  icon={<EditIcon fontSize="small" />}
                />
                <Box display="flex" flexWrap="wrap">
                  {journal.columnOrder.map(c =>
                    <Chip label={c} className={classes.columnOrderChip} />
                  )}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const useStyles = makeStyles(theme => ({
  tableRow: {
    cursor: 'pointer',
  },
}));

/**
 * See https://material-ui.com/components/tables/#collapsible-table.
 */
function AccountJournalsSettings(props) {
  const classes = useStyles();
  // const [addEditAssetDialogOpen, setAddEditAssetDialogOpen] = useState(false);
  // // Index of the Asset to edit when the edit asset button is clicked, set to -1 to add new asset
  // const [selectedAsset, setSelectedAsset] = useState(-1);
  // const [addEditAssetFields, setAddEditAssetFields] = useState({
  //   name: '',
  //   ticker: '',
  //   precision: '',
  //   pricePrecision: '',
  //   isCurrency: false,
  //   symbol: '',
  // });
  // const dispatch = useDispatch();
  const account = useSelector(selectActiveAccount);
  const journals = account.journals;

  // const openAddAssetDialog = () => {
  //   setSelectedAsset(-1);
  //   setAddEditAssetDialogOpen(true);
  // };

  // const handleAddEditAsset = () => {
  //   if (selectedAsset < 0) {
  //     // Add
  //     dispatch(addAsset({asset: {...addEditAssetFields}}));
  //   } else {
  //     // Edit
  //     dispatch(editAsset({asset: {...addEditAssetFields}, index: selectedAsset}));
  //   }
  //   setAddEditAssetDialogOpen(false);
  // };

  return (
    <React.Fragment>
      <SettingsSection>
        <Typography variant="h6" gutterBottom>Journals</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Columns</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {journals.map((j, i) =>
                <JournalRow journal={j} key={i} />
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={openAddAssetDialog}
        >
            Add New Asset
        </Button> */}
      </SettingsSection>
      {/* <AddEditAssetDialog
        open={addEditAssetDialogOpen}
        onDialogClose={() => setAddEditAssetDialogOpen(false)}
        edit={selectedAsset === -1 ? null : assets[selectedAsset]}
        fields={addEditAssetFields}
        onFieldsChange={fields => setAddEditAssetFields(fields)}
        onSubmit={handleAddEditAsset}
      /> */}
    </React.Fragment>
  );
}

export default AccountJournalsSettings;