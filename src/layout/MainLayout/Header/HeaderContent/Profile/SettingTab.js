// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// assets
import { LockOutlined, UserOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const navigate = useNavigate();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => { navigate('/companies/my'); }}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Company Settings" />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/missions/my'); }}>
        <ListItemIcon>
          <LockOutlined />
        </ListItemIcon>
        <ListItemText primary="Mission Settings" />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
