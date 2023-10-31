import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// scroll bar
import 'simplebar/src/simplebar.css';

// apex-chart
import 'assets/third-party/apex-chart.css';
import 'assets/third-party/react-table.css';
import 'assets/css/common.css';

// load mock apis
import '_api';

// project import
import App from './App';
import { store } from 'store';
import { ConfigProvider } from 'contexts/ConfigContext';
import reportWebVitals from './reportWebVitals';

import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './configs/keycloak';
import { dispatch } from './store/index';
import { LOADING_DETAILS_UPDATE } from 'store/reducers/actions';

const container = document.getElementById('root');
const root = createRoot(container);

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {  
  let [resource, config ] = args;

  if(resource?.startsWith(process.env.REACT_APP_JOBMARKET_API_BASE_URL))
    dispatch({ type: LOADING_DETAILS_UPDATE, payload: {isLoading: true} });

  const response = await originalFetch(resource, config);
  
  if(resource?.startsWith(process.env.REACT_APP_JOBMARKET_API_BASE_URL))
    dispatch({ type: LOADING_DETAILS_UPDATE, payload: {isLoading: false} });
  
  return response;
};

// const root = ReactDOM.createRoot(document.getElementById('root'));

// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

root.render(
  <ReactKeycloakProvider authClient={keycloak} initOptions={{ onLoad: 'login-required', checkLoginIframe: false }}>
    <ReduxProvider store={store}>
      <ConfigProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </ReduxProvider>
  </ReactKeycloakProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
