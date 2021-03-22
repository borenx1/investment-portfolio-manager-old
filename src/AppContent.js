import { useSelector } from 'react-redux';
import Transactions from './features/transactions/Transactions';
import CapitalChanges from './features/capital-changes/CapitalChanges';
import Journals from './features/journals/Journals';
import AccountSettings from './features/accounts/AccountSettings';
import { selectPage } from './features/navigation/navigationSlice';

function AppContent(props) {
  const activePage = useSelector(selectPage);
  switch (activePage) {
    case 'transactions':
      return <Transactions {...props} />;
    case 'capital-changes':
      return <CapitalChanges {...props} />;
    case 'journals':
      return <Journals {...props} />;
    case 'account-settings':
      return <AccountSettings {...props} />;
    default:
      console.warn(`Unable to navigate to page: ${activePage}`);
      return <Transactions {...props} />;
  }
}

export default AppContent;