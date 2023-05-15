// project import
import { FormattedMessage } from 'react-intl';

// assets
import {
  BankOutlined,
  UserOutlined,
  ProjectOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BankOutlined,
  UserOutlined,
  ProjectOutlined
};

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [{
    id: '10x',
    type: 'group',
    children: [
      {
        id: 'personal-information',
        title: <FormattedMessage id="personal-information" />,
        type: 'item',
        url: '/personal-information',
        icon: icons.UserOutlined
      },
      {
        id: 'employers',
        title: <FormattedMessage id="employers" />,
        type: 'item',
        url: '/employers/my',
        icon: icons.BankOutlined
      },
      {
        id: 'missions',
        title: <FormattedMessage id="missions" />,
        type: 'item',
        url: '/missions/my',
        icon: icons.ProjectOutlined
      }
    ]
  }]
};

export default menuItems;
