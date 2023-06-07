import UpsertMission from 'sections/mission/UpsertMission';
import { useParams } from 'react-router-dom';

const MissionOverviewTabContent = () => {
  let { missionId } = useParams();

  return (
    <UpsertMission missionId={missionId} />
  );
};

export default MissionOverviewTabContent;
