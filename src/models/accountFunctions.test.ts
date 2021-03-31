import { journalColumnRoleDisplay } from "./accountFunctions";

describe('journalColumnRoleDisplay', () => {
  test('expected values', () => {
    expect(journalColumnRoleDisplay('date')).toEqual('Date');
    expect(journalColumnRoleDisplay('base')).toEqual('Base');
    expect(journalColumnRoleDisplay('baseAmount')).toEqual('Base amount');
    expect(journalColumnRoleDisplay('quote')).toEqual('Quote');
    expect(journalColumnRoleDisplay('quoteAmount')).toEqual('Quote amount');
    expect(journalColumnRoleDisplay('price')).toEqual('Price');
    expect(journalColumnRoleDisplay('feeBase')).toEqual('Base fee');
    expect(journalColumnRoleDisplay('feeQuote')).toEqual('Quote fee');
    expect(journalColumnRoleDisplay('notes')).toEqual('Notes');
    expect(journalColumnRoleDisplay(0)).toEqual('Extra (1)');
    expect(journalColumnRoleDisplay(1)).toEqual('Extra (2)');
    expect(journalColumnRoleDisplay(10)).toEqual('Extra (11)');
    expect(journalColumnRoleDisplay(1.26246)).toEqual('Extra (2)');
    expect(journalColumnRoleDisplay(-1)).toEqual('Extra (0)');
  });
});