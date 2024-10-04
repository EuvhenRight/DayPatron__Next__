import MissionContractorMatches from 'sections/mission/MissionContractorMatches';
import { useParams } from 'react-router-dom';

const MissionContractorMatchesTabContent = () => {
  let { missionId } = useParams();

  return (
    <MissionContractorMatches missionId={missionId} />
  );
};

export default MissionContractorMatchesTabContent;
