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

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => { 
  
  const loadingDetails = useSelector(state => state.loadingDetails);

  return (
    <ThemeCustomization>
      {/* <RTLLayout> */}
      <Locales>
        <ScrollTop>
          <AuthProvider>
            <>
              <Notistack>
                <Routes />
                <Snackbar />
                {loadingDetails?.isLoading && <Loader />}
              </Notistack>
            </>
          </AuthProvider>
        </ScrollTop>
      </Locales>
      {/* </RTLLayout> */}
    </ThemeCustomization>
  );
};

export default App;
