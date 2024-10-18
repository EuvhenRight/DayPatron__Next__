// project import
import Routes from 'routes';
import ThemeCustomization from 'themes';
import Locales from 'components/Locales';
// import RTLLayout from 'components/RTLLayout';
import ScrollTop from 'components/ScrollTop';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import Loader from './components/Loader';

// auth-provider
import { KeycloakProvider as AuthProvider } from 'contexts/KeycloakContext';
import { useSelector } from 'react-redux';
import { ChatProvider } from './chat-context'; // Import ChatProvider

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const loadingDetails = useSelector((state) => state.loadingDetails);

  return (
    <ThemeCustomization>
      {/* <RTLLayout> */}
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <ChatProvider>
              <Notistack>
                <Routes />
                <Snackbar />
                {loadingDetails?.isLoading && <Loader />}
              </Notistack>
            </ChatProvider>
          </AuthProvider>
        </ScrollTop>
      </Locales>
      {/* </RTLLayout> */}
    </ThemeCustomization>
  );
};

export default App;
