import { useSelector } from 'react-redux';
import Journals from './features/journals/Journals';
import CapitalChanges from './features/capital-changes/CapitalChanges';
import AssetStatements from './features/asset-statements/AssetStatements';
import AccountSettings from './features/accounts/AccountSettings';
import { selectPage } from './features/navigation/navigationSlice';

function AppContent(props) {
  const activePage = useSelector(selectPage);
  switch (activePage) {
    case 'journals':
      return <Journals {...props} />;
    case 'capital-changes':
      return <CapitalChanges {...props} />;
    case 'asset-statements':
      return <AssetStatements {...props} />;
    case 'account-settings':
      return <AccountSettings {...props} />;
    default:
      console.warn(`Unable to navigate to page: ${activePage}`);
      return <Journals {...props} />;
  }
}

export default AppContent;