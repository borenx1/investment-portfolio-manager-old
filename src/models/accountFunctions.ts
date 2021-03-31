import { JournalColumnRole } from "./account";

export function journalColumnRoleDisplay(role: JournalColumnRole | undefined | null) {
  switch (role) {
    case undefined:
    case null:
      return role;
    case 'date':
      return 'Date';
    case 'base':
      return 'Base';
    case 'baseAmount':
      return 'Base amount';
    case 'quote':
      return 'Quote';
    case 'quoteAmount':
      return 'Quote amount';
    case 'price':
      return 'Price';
    case 'feeBase':
      return 'Base fee';
    case 'feeQuote':
      return 'Quote fee';
    case 'notes':
      return 'Notes';
    default:
      return `Extra (${(role + 1).toFixed()})`;
  }
}