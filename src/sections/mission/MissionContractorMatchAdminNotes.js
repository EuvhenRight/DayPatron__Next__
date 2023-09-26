import { useKeycloak } from '@react-keycloak/web';
import MissionContractorMatchAdminNotesEdit from 'sections/mission/MissionContractorMatchAdminNotesEdit';
import MissionContractorMatchAdminNotesView from 'sections/mission/MissionContractorMatchAdminNotesView';

const MissionContractorMatchAdminNotes = ({ missionId, contractorId, adminNotes, setAdminNotes }) => {
  const { keycloak } = useKeycloak();

  if (keycloak.tokenParsed.roles.includes('admin'))
    return (
      <MissionContractorMatchAdminNotesEdit missionId={missionId} contractorId={contractorId} adminNotes={adminNotes} setAdminNotes={setAdminNotes} />
    );

  return (
    <MissionContractorMatchAdminNotesView adminNotes={adminNotes} />
  );
};

export default MissionContractorMatchAdminNotes;
