import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import AccountMainSettings from './AccountMainSettings';
import AccountAssetsSettings from './AccountAssetsSettings';
import AccountJournalsSettings from './AccountJournalsSettings';

function AccountSettings() {
  return (
    <Container>
      <Box my={2}>
        <Typography variant="h4">Account Settings</Typography>
      </Box>
      <Box my={2}>
        <AccountMainSettings />
      </Box>
      <Box my={2}>
        <AccountAssetsSettings />
      </Box>
      <Box my={2}>
        <AccountJournalsSettings />
      </Box>
    </Container>
  );
}

export default AccountSettings;