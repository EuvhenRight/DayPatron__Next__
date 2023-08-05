// material-ui
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';

// assets
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

const SettingTab = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => { navigate('/missions'); }}>
        <ListItemIcon>
          <SearchOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'find-mission' })} />
      </ListItemButton>
      <ListItemButton onClick={() => { navigate('/invoices/settings'); }}>
        <ListItemIcon>
          <FileTextOutlined />
        </ListItemIcon>
        <ListItemText primary={intl.formatMessage({ id: 'invoice-settings' })} />
      </ListItemButton>
    </List>
  );
};

export default SettingTab;
