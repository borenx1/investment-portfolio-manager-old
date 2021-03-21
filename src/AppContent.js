import Transactions from './features/transactions/Transactions';
import CapitalChanges from './features/capital-changes/CapitalChanges';
import Journals from './features/journals/Journals';

function AppContent(props) {
  const { page, ...other } = props
  switch (page) {
    case 'transactions':
      return <Transactions {...other} />;
    case 'capital-changes':
      return <CapitalChanges {...other} />;
    case 'journals':
      return <Journals {...other} />;
    default:
      console.warn(`Unable to navigate to page: ${page}`);
      return <Transactions {...other} />;
  }
}

export default AppContent;