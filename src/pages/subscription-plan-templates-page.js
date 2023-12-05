import { useState, useEffect } from 'react';
import { 
  Grid,
  Button,
  Stack,
  Typography
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import MainCard from 'components/MainCard';
import SubscriptionPlanTemplateCard from 'sections/subscription/SubscriptionPlanTemplateCard';
import { prepareApiBody } from 'utils/stringUtils';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/reducers/snackbar';

const SubscriptionPlanTemplatesPage = () => {
  const { keycloak } = useKeycloak();
  const [templates, setTemplates] = useState([]);
  const dispatch = useDispatch();
  
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

  const onTemplateUpdated = (updatedTemplate, updatedTemplateIndex) => {
    let newTemplates = templates.map((template, templateIndex) => {
      if(templateIndex === updatedTemplateIndex)
        return updatedTemplate;
      
      return template;
    });

    setTemplates(newTemplates);
  }

  const onTemplateRemoved = (templateIndex) => {
    let newTemplates = [...templates];
    newTemplates.splice(templateIndex, 1);
    setTemplates(newTemplates);
  }

  const handleAddTemplate = () => {
    let newTemplates = [...templates, {rateType: 'Monthly'}];

    setTemplates(newTemplates);
  }
  
  const handleSaveClick = async () => {

    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/subscription-plans/templates',
        {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken,
            'Content-Type': 'application/json'
          },
          body: prepareApiBody({templates})
        }
      );

      if (!response.ok) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Update failed.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );

        return;
      }

      let json = await response.json();
      setTemplates(json?.templates);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Updated.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );

    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Update failed.',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      console.log(err);
    }
  };

  if (!keycloak.tokenParsed.roles.includes('admin'))
  return <Typography>Unauthorized</Typography>

  return (
    <Grid container spacing={1}>
      {templates?.map((template, templateIndex) => (
        <Grid key={templateIndex} item xs={12} md={4}>
          <MainCard>
            <SubscriptionPlanTemplateCard 
              template={template}
              templateIndex={templateIndex}
              onTemplateUpdated={onTemplateUpdated}
              onTemplateRemoved={onTemplateRemoved}>

            </SubscriptionPlanTemplateCard>
          </MainCard>
        </Grid>
      ))}
      <Grid item xs={12} md={4}>
        <MainCard>
          <Stack justifyContent="center" alignItems="center" sx={{height: 312}}>
            <Button onClick={handleAddTemplate} variant="outlined">
              Add
            </Button>
          </Stack>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
          <Button onClick={handleSaveClick} color="primary" variant="contained">
            Save
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
export default SubscriptionPlanTemplatesPage;
