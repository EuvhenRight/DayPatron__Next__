// third-party
import { FormattedMessage } from 'react-intl';

// assets
import {
  DashboardOutlined
} from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const profile = {
  id: 'dashboard-group',
  title: <FormattedMessage id="dashboard-group" />,
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: <FormattedMessage id="dashboard" />,
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined
    }
  ]
};

export default profile;
