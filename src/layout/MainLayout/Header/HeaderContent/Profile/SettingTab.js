// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// assets
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => { navigate('/companies/my'); }}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'companies' })} />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/missions/my'); }}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'my-missions' })} />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
