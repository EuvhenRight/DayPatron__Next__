import MainCard from 'components/MainCard';
import UpsertMission from 'sections/mission/UpsertMission';
import { useParams } from 'react-router-dom';

const MissionSection = () => {
  let { id } = useParams();

  return (
    <MainCard>
      <UpsertMission missionId={id} />
    </MainCard>
  );
};

export default MissionSection;
