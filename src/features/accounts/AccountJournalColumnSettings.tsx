import React from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Chip from "@material-ui/core/Chip";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import IconButtonHeading from "../../components/IconButtonHeading";
import DeleteButton from "../../components/DeleteButton";
import { deleteJournalColumn } from "./accountsSlice";
import { Journal, JournalColumn, JournalColumnRole, journalColumnRoleDisplay } from "../../models/account";

interface JournalColumnRowProps {
  role: JournalColumnRole;
  journalIndex: number;
  journalColumn: JournalColumn;
  onClick?: React.MouseEventHandler<HTMLTableRowElement>;
}

const useJournalColumnRowStyles = makeStyles<Theme, JournalColumnRowProps>(theme => ({
  root: {
    cursor: props => props.onClick ? 'pointer' : undefined,
  },
}));

function JournalColumnRow(props: JournalColumnRowProps) {
  const classes = useJournalColumnRowStyles(props);
  const { role, journalIndex, journalColumn, onClick } = props;
  const dispatch = useDispatch();

  const handleDeleteColumn = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (typeof role === 'number') {
      dispatch(deleteJournalColumn({journalIndex: journalIndex, columnIndex: role}));
    }
    e.stopPropagation();
  };

  return (
    <TableRow hover onClick={onClick} className={classes.root}>
      <TableCell>{ journalColumnRoleDisplay(role) }</TableCell>
      <TableCell>{ journalColumn.name }</TableCell>
      <TableCell>{ journalColumn.type }</TableCell>
      <TableCell align="center">
        {journalColumn.type === 'decimal' && (
          Object.keys(journalColumn.precision).length === 0 ?
            'Default' :
            `${Object.keys(journalColumn.precision).length} mapping(s)`
        )}
      </TableCell>
      <TableCell align="center">{ journalColumn.type === 'date' && (journalColumn.showTime ? 'Yes' : 'No') }</TableCell>
      <TableCell align="center">{ journalColumn.hide ? 'Yes' : 'No' }</TableCell>
      <TableCell align="center">
        <DeleteButton
          buttonSize="small"
          iconSize="small"
          disabled={typeof role !== 'number'}
          onClick={handleDeleteColumn}
        />
      </TableCell>
    </TableRow>
  );
}

interface Props {
  index: number;
  journal: Journal;
  onAddColumn?: (journal: number) => void;
  onEditColumn?: (journal: number, role: JournalColumnRole) => void;
  onEditColumnOrder?: (journal: number) => void;
}

const useStyles = makeStyles((theme) => ({
  columnOrderChip: {
    marginRight: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
  },
}));

function AccountJournalColumnSettings(props: Props) {
  const classes = useStyles();
  const { index, journal, onAddColumn, onEditColumn, onEditColumnOrder } = props;

  return (
    <React.Fragment>
      <IconButtonHeading
        variant="h6"
        title="Columns"
        icon={<AddIcon fontSize="small" />}
        onClick={() => onAddColumn?.(index)}
      />
      <Table size="small" aria-label="Journal columns">
        <TableHead>
          <TableRow>
            <TableCell>Role</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Type</TableCell>
            <TableCell align="center">Precision</TableCell>
            <TableCell align="center">Show Time</TableCell>
            <TableCell align="center">Hide</TableCell>
            <TableCell align="center"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(journal.columns).map(([role, column]: [string, JournalColumn]) =>
            role !== 'extra' && <JournalColumnRow
              role={role as JournalColumnRole}
              journalIndex={index}
              journalColumn={column}
              onClick={() => onEditColumn?.(index, role as JournalColumnRole)}
              key={role}
            />
          )}
          {journal.columns.extra.map((column, colIndex: number) =>
            <JournalColumnRow
              role={colIndex}
              journalIndex={index}
              journalColumn={column}
              onClick={() => onEditColumn?.(index, colIndex)}
              key={colIndex}
            />
          )}
        </TableBody>
      </Table>
      <Box mt={1}>
        <IconButtonHeading
          variant="h6"
          title="Column Order"
          icon={<EditIcon fontSize="small" />}
          onClick={() => onEditColumnOrder?.(index)}
        />
        <Box display="flex" flexWrap="wrap">
          {journal.columnOrder.map(c =>
            <Chip label={journalColumnRoleDisplay(c)} className={classes.columnOrderChip} key={c} />
          )}
        </Box>
      </Box>
    </React.Fragment>
  );
}

export default AccountJournalColumnSettings;