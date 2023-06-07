import { useState, useEffect } from 'react';
import { useKeycloak } from '@react-keycloak/web';


// ==============================|| MISSION CONTRACTOR MATCH ||============================== //

const MissionContractorMatch = ({ missionId, contractorId }) => {
  const { keycloak } = useKeycloak();
  const [missionContractorMatch, setMissionContractorMatch] = useState({});

  const bindMissionContractorMatch = async () => {
    try {
      let response = await fetch(process.env.REACT_APP_JOBMARKET_API_BASE_URL + '/missions/' + encodeURIComponent(missionId) + '/matches/' + encodeURIComponent(contractorId),
        {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer ' + keycloak.idToken
          }
        }
      );

      let json = await response.json();

      setMissionContractorMatch(json.missionContractorMatch);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async () => {
      await bindMissionContractorMatch();
    })();
  }, []);

  return (
    <>
      {missionContractorMatch?.contractor?.firstName}
      {missionContractorMatch?.contractorPeraSurveyResponse?.responseResultsTree?.map((item, index) => {
        return (<div key={index}>{item?.percentile}</div>);
      })}
    </>
  );
};

export default MissionContractorMatch;
