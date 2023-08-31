import { useParams } from 'react-router-dom';
import UpsertMissionOrder from 'sections/order/UpsertMissionOrder';

// project import
import MainCard from 'components/MainCard';

const MissionOrderPage = () => {
  const { missionOrderId } = useParams();

  return (
    <MainCard>
      <UpsertMissionOrder missionOrderId={missionOrderId}></UpsertMissionOrder>
    </MainCard>
  );
};

export default MissionOrderPage;
