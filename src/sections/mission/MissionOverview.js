import UpsertMission from 'sections/mission/UpsertMission';
import { useParams } from 'react-router-dom';

const MissionOverview = () => {
  let { id } = useParams();

  return (
    <UpsertMission missionId={id} />
  );
};

export default MissionOverview;
