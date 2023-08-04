import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import {
  UserOutlined,
  BulbOutlined,
  SettingOutlined,
  CalendarOutlined,
  LogoutOutlined
} from '@ant-design/icons';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => { navigate('/profile/personal'); }}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'profile-personal' })} />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/profile/expertise'); }}>
        <ListItemIcon>
          <BulbOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'profile-expertise' })} />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/profile/preferences'); }}>
        <ListItemIcon>
          <SettingOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'profile-preferences' })} />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/profile/availability'); }}>
        <ListItemIcon>
          <CalendarOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'profile-availability' })} />
      </ListItemButton>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
