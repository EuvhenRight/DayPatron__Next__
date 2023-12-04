import { useState, useEffect } from 'react';
import { 
  Grid,
  Button,
  Stack
} from '@mui/material';
import { useKeycloak } from '@react-keycloak/web';
import MainCard from 'components/MainCard';
import SubscriptionPlanTemplateCard from 'sections/subscription/SubscriptionPlanTemplateCard';

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
    let newTemplates = [...templates, {}];

    setTemplates(newTemplates);
  }

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
            <Button onClick={handleAddTemplate} color="primary" variant="contained">
              Add
            </Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
export default SubscriptionPlanTemplatesPage;
