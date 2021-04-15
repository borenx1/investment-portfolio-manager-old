/** Insert a transaction in the correct position ordered by date from oldest to newest. */
export function addTransactionOrdered<T extends {date: string}>(transactions: T[], newTransaction: T): void {
  for (let i = transactions.length; i >= 0; i--) {
    if (i === 0 || new Date(newTransaction.date) >= new Date(transactions[i-1]!.date)) {
      transactions.splice(i, 0, newTransaction);
      break;
    }
  }
}