import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import MissionContractorMatchAdminDetailsEdit from 'sections/mission/MissionContractorMatchAdminDetailsEdit';
import MissionContractorMatchAdminDetailsView from 'sections/mission/MissionContractorMatchAdminDetailsView';

const MissionContractorMatchAdminDetails = ({ missionId, contractorId }) => {
  const { keycloak } = useKeycloak();
  const [adminDetails, setAdminDetails] = useState(null);

  const bindData = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId) + '/admin-details',
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setAdminDetails(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindData();
    })();
  }, []);

  if (keycloak.tokenParsed.roles.includes('admin'))
    return (
      <MissionContractorMatchAdminDetailsEdit missionId={missionId} contractorId={contractorId} adminDetails={adminDetails} setAdminDetails={setAdminDetails} />
    );

  return (
    <MissionContractorMatchAdminDetailsView adminDetails={adminDetails} />
  );
};

export default MissionContractorMatchAdminDetails;
