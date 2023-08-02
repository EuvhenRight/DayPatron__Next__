// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// assets
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const navigate = useNavigate();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => { navigate('/missions'); }}>
        <ListItemIcon>
          <SearchOutlined />
        </ListItemIcon>
        <ListItemText primary="Mission Settings" />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/invoices/settings'); }}>
        <ListItemIcon>
          <FileTextOutlined />
        </ListItemIcon>
        <ListItemText primary="Invoice Settings" />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
