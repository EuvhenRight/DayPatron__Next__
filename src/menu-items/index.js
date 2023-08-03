// project import
import { FormattedMessage } from 'react-intl';

// assets
import {
  BankOutlined,
  UserOutlined,
  ProjectOutlined,
  BlockOutlined
} from '@ant-design/icons';

// icons
const icons = {
  BankOutlined,
  UserOutlined,
  ProjectOutlined,
  BlockOutlined
};

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    {
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
          id: 'companies',
          title: <FormattedMessage id="companies" />,
          type: 'item',
          url: '/companies/my',
          icon: icons.BankOutlined
        }
      ]
    },
    {
      id: 'missions',
      title: <FormattedMessage id="missions" />,
      type: 'group',
      children: [
        {
          id: 'my-missions',
          title: <FormattedMessage id="my-missions" />,
          type: 'item',
          url: '/missions/my',
          icon: icons.ProjectOutlined
        },
        {
          id: 'matches',
          title: <FormattedMessage id="matches" />,
          type: 'item',
          url: '/missions/matches',
          icon: icons.BlockOutlined
        }
      ]
    }
  ]
};

export default menuItems;
