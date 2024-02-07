import { useParams } from 'react-router-dom';
import UpdateMissionOrder from 'sections/order/UpdateMissionOrder';

// project import
import MainCard from 'components/MainCard';

const MissionOrderPage = () => {
  const { missionOrderId } = useParams();

  return (
    <MainCard>
      <UpdateMissionOrder missionOrderId={missionOrderId}></UpdateMissionOrder>
    </MainCard>
  );
};

export default MissionOrderPage;
