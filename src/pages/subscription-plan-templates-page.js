import { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormHelperText,
  InputLabel,
  TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import { useKeycloak } from '@react-keycloak/web';
import { normalizeInputValue } from 'utils/stringUtils';

const SubscriptionPlanTemplatesPage = () => {
  const { keycloak } = useKeycloak();
  const [templates, setTemplates] = useState([]);
  
  useEffect(() => {
    (async () => {
      await bindTemplates();
    })();
  }, [keycloak?.idToken]);

  const bindTemplates = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscription-plans/templates',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );
      let json = await response.json();

      setTemplates(json?.templates);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Grid container spacing={1}>
      {templates?.map((template, templateIndex) => (
        <Grid key={templateIndex} item xs={4}>
          
        </Grid>
      ))}
    </Grid>
  );
}
export default SubscriptionPlanTemplatesPage;
