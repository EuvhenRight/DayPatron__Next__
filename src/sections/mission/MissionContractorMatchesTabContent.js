import MissionContractorMatches from 'sections/mission/MissionContractorMatches';
import MissionContractorMatch from 'sections/mission/MissionContractorMatch';
import { useParams } from 'react-router-dom';

const MissionContractorMatchesTabContent = () => {
  let { missionId, contractorId } = useParams();

  if (contractorId)
    return (
      <MissionContractorMatch missionId={missionId} contractorId={contractorId} />
    );

  return (
    <MissionContractorMatches missionId={missionId} />
  );
};

export default MissionContractorMatchesTabContent;
