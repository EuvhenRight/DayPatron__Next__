import { useState } from 'react';
import { useLocation, useParams, Link, Outlet } from 'react-router-dom';

// material-ui
import { Box, Tab, Tabs } from '@mui/material';

// project import
import MainCard from 'components/MainCard';

// assets
import { FileTextOutlined, BlockOutlined } from '@ant-design/icons';

const MissionSection = () => {
  let { id } = useParams();
  const { pathname } = useLocation();

  let selectedTab = 0;
  switch (pathname) {
    case '/missions/' + id + '/matches':
      selectedTab = 1;
      break;
    case '/missions/' + id + '/overview':
    default:
      selectedTab = 0;
  }

  const [value, setValue] = useState(selectedTab);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <MainCard>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
        <Tabs value={value} onChange={handleChange} variant="scrollable" scrollButtons="auto" aria-label="account profile tab">
          <Tab label="Overview" component={Link} to={'/missions/' + id + '/overview'} icon={<FileTextOutlined />} iconPosition="start" />
          <Tab label="Matches" component={Link} to={'/missions/' + id + '/matches'} icon={<BlockOutlined />} iconPosition="start" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2.5 }}>
        <Outlet />
      </Box>

    </MainCard>
  );
};

export default MissionSection;
