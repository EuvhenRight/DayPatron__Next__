import { useLocation, useParams, Link, Outlet } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { FileTextOutlined, BlockOutlined } from '@ant-design/icons';

const MissionSection = () => {
  let { missionId } = useParams();
  const { pathname } = useLocation();

  let selectedTab = 0;
  if (pathname.startsWith('/missions/' + missionId + '/matches')) {
    selectedTab = 1;
  }
  
  return (
    <MainCard>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={selectedTab} variant="scrollable" scrollButtons="auto" aria-label="mission tabs">
          <Tab label="Overview" component={Link} to={'/missions/' + missionId + '/overview'} icon={<FileTextOutlined />} iconPosition="start" />
          <Tab label="Matches" component={Link} to={'/missions/' + missionId + '/matches'} icon={<BlockOutlined />} iconPosition="start" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Outlet />
      </Box>

    </MainCard>
  );
};

export default MissionSection;
