import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import MissionContractorMatchAdminNotesEdit from 'sections/mission/MissionContractorMatchAdminNotesEdit';
import MissionContractorMatchAdminNotesView from 'sections/mission/MissionContractorMatchAdminNotesView';

const MissionContractorMatchAdminNotes = ({ missionId, contractorId }) => {
  const { keycloak } = useKeycloak();
  const [adminNotes, setAdminNotes] = useState(null);

  const bindData = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/contractors/' + encodeURIComponent(contractorId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setAdminNotes(json.adminNotes);
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
      <MissionContractorMatchAdminNotesEdit missionId={missionId} contractorId={contractorId} adminNotes={adminNotes} setAdminNotes={setAdminNotes} />
    );

  return (
    <MissionContractorMatchAdminNotesView adminNotes={adminNotes} />
  );
};

export default MissionContractorMatchAdminNotes;
