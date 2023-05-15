import MainCard from 'components/MainCard';
import UpsertEmployer from 'sections/employer/UpsertEmployer';
import { useParams } from 'react-router-dom';

const EmployerSection = () => {
  let { id } = useParams();

  return (
    <MainCard>
      <UpsertEmployer employerId={id} />
    </MainCard>
  );
};

export default EmployerSection;
